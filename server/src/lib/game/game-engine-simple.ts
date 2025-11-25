import { db } from '@/db/config';
import {
  type ActionType,
  type GameCard,
  type GamePhase,
  type GamePlayer,
  type GameSession,
  type GameStep,
  cardsTable,
  deckCards,
  gameActionsTable,
  gameCardsTable,
  gamePlayersTable,
  gameRoomsTable,
  gameSessionsTable,
  gameStateSnapshotsTable,
} from '@/db/schemas';
import { and, eq } from 'drizzle-orm';
import { EnergySystem } from './energy-system';
import { gameEventEmitter } from './game-event-emitter';
import { AttackStrategyFactory } from './strategies/attack-strategy';
import { gameSocketManager } from '@/lib/websocket';

// Type for database transaction
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export interface GameState {
  gameId: number;
  currentTurn: number;
  currentPlayerIndex: number;
  phase: GamePhase;
  step: GameStep;
  players: GamePlayer[];
  cards: GameCard[];
}

export interface GameAction {
  type: ActionType;
  playerId: number;
  data?: Record<string, unknown>;
}

export class GameEngine {
  private gameState: Map<number, GameState> = new Map();

  /**
   * Create a new game session from a ready room
   */
  async createGameSession(roomId: number): Promise<GameSession> {
    // Get room information
    const room = await db.query.gameRoomsTable.findFirst({
      where: eq(gameRoomsTable.id, roomId),
      with: {
        players: true,
      },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.status !== 'waiting') {
      throw new Error('Room is not in waiting status');
    }

    if (room.players.length < 2) {
      throw new Error('Need at least 2 players to start a game');
    }

    // Check if all players are ready
    const allPlayersReady = room.players.every(
      (player) => player.isReady === 'ready'
    );
    if (!allPlayersReady) {
      throw new Error('All players must be ready to start the game');
    }

    // Use transaction to ensure atomicity
    return await db.transaction(async (tx) => {
      // Create game session
      const [gameSession] = await tx
        .insert(gameSessionsTable)
        .values({
          roomId,
          status: 'active',
          startedAt: new Date(),
        })
        .returning();

      // Create game players
      const gamePlayers: GamePlayer[] = [];
      for (let i = 0; i < room.players.length; i++) {
        const roomPlayer = room.players[i];
        const [gamePlayer] = await tx
          .insert(gamePlayersTable)
          .values({
            gameId: gameSession.id,
            playerId: roomPlayer.playerId,
            deckId: roomPlayer.deckId || undefined,
            playerIndex: i,
            lifeTotal: 20, // Default life total
          })
          .returning();
        gamePlayers.push(gamePlayer);
      }

      // Initialize player decks and hands
      await this.initializePlayerDecks(tx, gameSession.id, gamePlayers);

      // Update room status to in_progress
      await tx
        .update(gameRoomsTable)
        .set({ status: 'in_progress' })
        .where(eq(gameRoomsTable.id, roomId));

      // Initialize energy for all players
      for (const gamePlayer of gamePlayers) {
        await tx
          .update(gamePlayersTable)
          .set({
            energy: 1,
            maxEnergy: 1,
          })
          .where(eq(gamePlayersTable.id, gamePlayer.id));
      }

      // Create initial game state
      const gameState: GameState = {
        gameId: gameSession.id,
        currentTurn: 1,
        currentPlayerIndex: 0,
        phase: 'untap',
        step: 'beginning',
        players: gamePlayers,
        cards: [],
      };

      this.gameState.set(gameSession.id, gameState);

      // Start first player's turn (set energy, then move to draw phase)
      const firstPlayer = gamePlayers[0];
      await EnergySystem.startTurn(tx, gameSession.id, firstPlayer.playerId);

      // Move to draw phase and draw starting hand
      gameState.phase = 'draw';
      await this.drawCards(tx, gameSession.id, firstPlayer.playerId, 1);

      // Create initial snapshot
      await this.createGameSnapshot(tx, gameSession.id, gameState);

      // Register game with socket manager
      await gameSocketManager.registerGame(gameSession.id, roomId);

      // Emit game started event
      await gameEventEmitter.emit({
        type: 'game_started',
        gameId: gameSession.id,
        data: {
          gameId: gameSession.id,
          players: gamePlayers.map((p) => ({
            playerId: p.playerId,
            playerIndex: p.playerIndex,
          })),
        },
        timestamp: new Date(),
      });

      return gameSession;
    });
  }

  /**
   * Initialize player decks and starting hands
   */
  private async initializePlayerDecks(
    tx: Transaction,
    gameId: number,
    gamePlayers: GamePlayer[]
  ): Promise<void> {
    for (const gamePlayer of gamePlayers) {
      if (!gamePlayer.deckId) continue;

      // Get deck cards
      const deckCardsResult = await tx.query.deckCards.findMany({
        where: eq(deckCards.deckId, gamePlayer.deckId),
        with: {
          card: true,
        },
      });

      // Create game cards for deck
      const gameCardsData = [];
      for (let i = 0; i < deckCardsResult.length; i++) {
        const deckCard = deckCardsResult[i];
        if (deckCard.cardId) {
          // Add null check
          gameCardsData.push({
            gameId,
            cardId: deckCard.cardId,
            ownerId: gamePlayer.playerId,
            controllerId: gamePlayer.playerId,
            location: 'deck' as const,
            zoneIndex: i,
            power: deckCard.card?.power ?? 0,
            toughness: deckCard.card?.toughness ?? 0,
          });
        }
      }

      // Insert deck cards
      await tx.insert(gameCardsTable).values(gameCardsData);

      // Draw starting hand (5 cards)
      await this.drawCards(tx, gameId, gamePlayer.playerId, 5);
    }
  }

  /**
   * Draw cards for a player
   */
  private async drawCards(
    tx: Transaction,
    gameId: number,
    playerId: number,
    count: number
  ): Promise<void> {
    // Get cards from deck
    const deckCardsResult = await tx
      .select()
      .from(gameCardsTable)
      .where(
        and(
          eq(gameCardsTable.gameId, gameId),
          eq(gameCardsTable.ownerId, playerId),
          eq(gameCardsTable.location, 'deck')
        )
      )
      .orderBy(gameCardsTable.zoneIndex)
      .limit(count);

    if (deckCardsResult.length === 0) return;

    // Move cards to hand
    for (let i = 0; i < deckCardsResult.length; i++) {
      await tx
        .update(gameCardsTable)
        .set({
          location: 'hand',
          zoneIndex: i,
        })
        .where(eq(gameCardsTable.id, deckCardsResult[i].id));
    }

    // Update player stats
    await tx
      .update(gamePlayersTable)
      .set({
        handSize: deckCardsResult.length,
        deckSize: -deckCardsResult.length,
      })
      .where(
        and(
          eq(gamePlayersTable.gameId, gameId),
          eq(gamePlayersTable.playerId, playerId)
        )
      );
  }

  /**
   * Process a game action
   */
  async processGameAction(gameId: number, action: GameAction): Promise<void> {
    const gameState = this.gameState.get(gameId);
    if (!gameState) {
      throw new Error('Game not found');
    }

    // Validate action
    if (!this.isValidAction(gameState, action)) {
      throw new Error('Invalid action for current game state');
    }

    // Use transaction to process action
    await db.transaction(async (tx) => {
      // Log the action
      await tx.insert(gameActionsTable).values({
        gameId,
        playerId: action.playerId,
        actionType: action.type,
        actionData: action.data,
        turnNumber: gameState.currentTurn,
        phase: gameState.phase,
        step: gameState.step,
      });

      // Process the action
      await this.executeAction(tx, gameId, action, gameState);

      // Update game state
      await this.updateGameState(tx, gameId, gameState);

      // Create snapshot
      await this.createGameSnapshot(tx, gameId, gameState);

      // Emit game state updated event
      await gameEventEmitter.emit({
        type: 'game_state_updated',
        gameId,
        playerId: action.playerId,
        data: {
          gameId,
          currentTurn: gameState.currentTurn,
          currentPlayerIndex: gameState.currentPlayerIndex,
          phase: gameState.phase,
        },
        timestamp: new Date(),
      });
    });
  }

  /**
   * Check if an action is valid for the current game state
   */
  private isValidAction(gameState: GameState, action: GameAction): boolean {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (action.playerId !== currentPlayer.playerId) {
      return false; // Only current player can take actions
    }

    return true;
  }

  /**
   * Execute a game action
   */
  private async executeAction(
    tx: Transaction,
    gameId: number,
    action: GameAction,
    gameState: GameState
  ): Promise<void> {
    switch (action.type) {
      case 'end_turn':
        await this.endTurn(tx, gameId, gameState);
        break;
      case 'play_card':
        await this.playCard(tx, gameId, action);
        break;
      case 'attack':
        await this.attack(tx, gameId, action, gameState);
        break;
      case 'draw_card':
        await this.drawCards(tx, gameId, action.playerId, 1);
        break;
      default:
        throw new Error(`Unsupported action type: ${action.type}`);
    }
  }

  /**
   * Attack with a creature (direct attack to opponent)
   */
  private async attack(
    tx: Transaction,
    gameId: number,
    action: GameAction,
    gameState: GameState
  ): Promise<void> {
    const attackData = action.data as { cardId: number };
    if (!attackData?.cardId) {
      throw new Error('Card ID is required to attack');
    }

    // Get the attacking creature
    const attacker = await tx
      .select()
      .from(gameCardsTable)
      .where(
        and(
          eq(gameCardsTable.gameId, gameId),
          eq(gameCardsTable.id, attackData.cardId),
          eq(gameCardsTable.location, 'battlefield'),
          eq(gameCardsTable.ownerId, action.playerId)
        )
      )
      .limit(1);

    if (attacker.length === 0) {
      throw new Error('Attacking creature not found');
    }

    const attackingCreature = attacker[0];

    if (!attackingCreature.power || attackingCreature.power <= 0) {
      throw new Error('Creature has no attack power');
    }

    // Find opponent
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const opponent = gameState.players.find(
      (p) => p.playerId !== currentPlayer.playerId
    );

    if (!opponent) {
      throw new Error('Opponent not found');
    }

    // Get card definition to check for abilities
    const cardDef = await tx.query.cardsTable.findFirst({
      where: eq(cardsTable.id, attackingCreature.cardId),
    });

    // Get attack strategy based on card abilities
    const abilities = cardDef?.abilities
      ? (cardDef.abilities as Array<{ name: string }>).map((a) => a.name)
      : [];
    const attackStrategy = AttackStrategyFactory.getStrategy(abilities);
    const attackResult = attackStrategy.attack(attackingCreature.power ?? 0);

    // Deal damage to opponent
    const damage = attackResult.damage;
    const oldLifeTotal = opponent.lifeTotal;
    const newLifeTotal = Math.max(0, oldLifeTotal - damage);

    await tx
      .update(gamePlayersTable)
      .set({ lifeTotal: newLifeTotal })
      .where(eq(gamePlayersTable.id, opponent.id));

    // Update opponent in game state
    opponent.lifeTotal = newLifeTotal;

    // Emit attack declared event
    await gameEventEmitter.emit({
      type: 'attack_declared',
      gameId,
      playerId: action.playerId,
      data: {
        attackerId: attackingCreature.id,
        attackerPower: attackingCreature.power ?? 0,
        targetPlayerId: opponent.playerId,
      },
      timestamp: new Date(),
    });

    // Emit damage dealt event
    await gameEventEmitter.emit({
      type: 'damage_dealt',
      gameId,
      playerId: action.playerId,
      data: {
        amount: damage,
        targetPlayerId: opponent.playerId,
        newHealth: newLifeTotal,
      },
      timestamp: new Date(),
    });

    // Emit player health changed event
    await gameEventEmitter.emit({
      type: 'player_health_changed',
      gameId,
      playerId: opponent.playerId,
      data: {
        playerId: opponent.playerId,
        oldHealth: oldLifeTotal,
        newHealth: newLifeTotal,
      },
      timestamp: new Date(),
    });

    // Check for game over
    if (newLifeTotal <= 0) {
      gameState.phase = 'end';
      // Emit game ended event
      await gameEventEmitter.emit({
        type: 'game_ended',
        gameId,
        playerId: action.playerId,
        data: {
          winnerId: action.playerId,
          loserId: opponent.playerId,
        },
        timestamp: new Date(),
      });
    }
  }

  /**
   * End the current turn and advance to next player
   */
  private async endTurn(
    tx: Transaction,
    gameId: number,
    gameState: GameState
  ): Promise<void> {
    // Advance to next player
    gameState.currentPlayerIndex =
      (gameState.currentPlayerIndex + 1) % gameState.players.length;

    // If we've completed a full round, advance turn
    if (gameState.currentPlayerIndex === 0) {
      gameState.currentTurn++;
    }

    // Reset phase and step for new player (start with untap, then move to draw)
    gameState.phase = 'untap';
    gameState.step = 'beginning';

    // Start new turn for the new player (gain energy)
    const newPlayer = gameState.players[gameState.currentPlayerIndex];
    await EnergySystem.startTurn(tx, gameId, newPlayer.playerId);

    // Move to draw phase and draw card
    gameState.phase = 'draw';
    await this.drawCards(tx, gameId, newPlayer.playerId, 1);

    // Get updated player energy
    const playerEnergy = await EnergySystem.getPlayerEnergy(
      gameId,
      newPlayer.playerId
    );

    // Update game session
    await tx
      .update(gameSessionsTable)
      .set({
        currentTurn: gameState.currentTurn,
        currentPlayerIndex: gameState.currentPlayerIndex,
        phase: gameState.phase,
        step: gameState.step,
        updatedAt: new Date(),
      })
      .where(eq(gameSessionsTable.id, gameId));

    // Emit turn started event
    await gameEventEmitter.emit({
      type: 'turn_started',
      gameId,
      playerId: newPlayer.playerId,
      data: {
        playerId: newPlayer.playerId,
        turnNumber: gameState.currentTurn,
        energy: playerEnergy.energy,
        maxEnergy: playerEnergy.maxEnergy,
      },
      timestamp: new Date(),
    });
  }

  /**
   * Play a card from hand
   */
  private async playCard(
    tx: Transaction,
    gameId: number,
    action: GameAction
  ): Promise<void> {
    const cardData = action.data as { cardId: number; targetId?: number };
    if (!cardData?.cardId) {
      throw new Error('Card ID is required to play a card');
    }

    // Get the card definition to check energy cost
    const gameCard = await tx
      .select()
      .from(gameCardsTable)
      .where(
        and(
          eq(gameCardsTable.gameId, gameId),
          eq(gameCardsTable.id, cardData.cardId),
          eq(gameCardsTable.location, 'hand')
        )
      )
      .limit(1);

    if (gameCard.length === 0) {
      throw new Error('Card not found in hand');
    }

    const cardInHand = gameCard[0];

    // Get card definition
    const cardDef = await tx.query.cardsTable.findFirst({
      where: eq(cardsTable.id, cardInHand.cardId),
    });

    if (!cardDef) {
      throw new Error('Card definition not found');
    }

    // Validate energy cost using EnergySystem
    const canPlay = await EnergySystem.canPlayCard(
      gameId,
      action.playerId,
      cardDef.id
    );
    if (!canPlay.canPlay) {
      throw new Error(`Cannot play card: ${canPlay.reason}`);
    }

    // Pay the energy cost
    const energyCost = EnergySystem.getCardEnergyCost(cardDef);
    const playerEnergyBefore = await EnergySystem.getPlayerEnergy(
      gameId,
      action.playerId
    );
    await EnergySystem.payEnergyCost(gameId, action.playerId, energyCost);
    const playerEnergyAfter = await EnergySystem.getPlayerEnergy(
      gameId,
      action.playerId
    );

    // Move card to battlefield
    await tx
      .update(gameCardsTable)
      .set({
        location: 'battlefield',
        zoneIndex: 0,
      })
      .where(eq(gameCardsTable.id, cardInHand.id));

    // Update player stats
    await tx
      .update(gamePlayersTable)
      .set({
        handSize: -1,
      })
      .where(
        and(
          eq(gamePlayersTable.gameId, gameId),
          eq(gamePlayersTable.playerId, action.playerId)
        )
      );

    // Emit card played event
    await gameEventEmitter.emit({
      type: 'card_played',
      gameId,
      playerId: action.playerId,
      data: {
        cardId: cardDef.id,
        cardName: cardDef.name,
        playerId: action.playerId,
        energyCost,
      },
      timestamp: new Date(),
    });

    // Emit energy changed event
    await gameEventEmitter.emit({
      type: 'energy_changed',
      gameId,
      playerId: action.playerId,
      data: {
        playerId: action.playerId,
        oldEnergy: playerEnergyBefore.energy,
        newEnergy: playerEnergyAfter.energy,
        maxEnergy: playerEnergyAfter.maxEnergy,
      },
      timestamp: new Date(),
    });
  }

  /**
   * Update game state in database
   */
  private async updateGameState(
    tx: Transaction,
    gameId: number,
    gameState: GameState
  ): Promise<void> {
    await tx
      .update(gameSessionsTable)
      .set({
        currentTurn: gameState.currentTurn,
        currentPlayerIndex: gameState.currentPlayerIndex,
        phase: gameState.phase,
        step: gameState.step,
        updatedAt: new Date(),
      })
      .where(eq(gameSessionsTable.id, gameId));
  }

  /**
   * Create a game state snapshot
   */
  private async createGameSnapshot(
    tx: Transaction,
    gameId: number,
    gameState: GameState
  ): Promise<void> {
    await tx.insert(gameStateSnapshotsTable).values({
      gameId,
      turnNumber: gameState.currentTurn,
      phase: gameState.phase,
      step: gameState.step,
      gameState: gameState,
    });
  }

  /**
   * Get current game state
   */
  getGameState(gameId: number): GameState | undefined {
    return this.gameState.get(gameId);
  }

  /**
   * End a game session
   */
  async endGameSession(gameId: number, winnerId?: number): Promise<void> {
    const gameState = this.gameState.get(gameId);
    if (!gameState) {
      throw new Error('Game not found');
    }

    await db.transaction(async (tx) => {
      // Update game session
      await tx
        .update(gameSessionsTable)
        .set({
          status: 'finished',
          finishedAt: new Date(),
          winnerId,
          updatedAt: new Date(),
        })
        .where(eq(gameSessionsTable.id, gameId));

      // Update room status back to waiting
      const gameSession = await tx.query.gameSessionsTable.findFirst({
        where: eq(gameSessionsTable.id, gameId),
        with: {
          room: true,
        },
      });

      if (gameSession?.roomId) {
        await tx
          .update(gameRoomsTable)
          .set({ status: 'waiting' })
          .where(eq(gameRoomsTable.id, gameSession.roomId));
      }
    });

    // Remove from memory
    this.gameState.delete(gameId);
  }

  /**
   * Get all active games
   */
  getActiveGames(): GameState[] {
    return Array.from(this.gameState.values());
  }
}

// Export singleton instance
export const gameEngine = new GameEngine();
