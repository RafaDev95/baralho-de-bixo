import { db } from '@/db/config';
import {
  type ActionType,
  type GameCard,
  type GamePhase,
  type GamePlayer,
  type GameSession,
  type GameStep,
  deckCards,
  gameActionsTable,
  gameCardsTable,
  gamePlayersTable,
  gameRoomsTable,
  gameSessionsTable,
  gameStateSnapshotsTable,
} from '@/db/schemas';
import { and, eq } from 'drizzle-orm';

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

      // Create initial snapshot
      await this.createGameSnapshot(tx, gameSession.id, gameState);

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

      // Draw starting hand (7 cards)
      await this.drawCards(tx, gameId, gamePlayer.playerId, 7);
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
      case 'draw_card':
        await this.drawCards(tx, gameId, action.playerId, 1);
        break;
      default:
        throw new Error(`Unsupported action type: ${action.type}`);
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

    // Reset phase and step for new player
    gameState.phase = 'untap';
    gameState.step = 'beginning';

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

    // Get the card from hand
    const cardResult = await tx
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

    if (cardResult.length === 0) {
      throw new Error('Card not found in hand');
    }

    const gameCard = cardResult[0];

    // Move card to battlefield
    await tx
      .update(gameCardsTable)
      .set({
        location: 'battlefield',
        zoneIndex: 0,
      })
      .where(eq(gameCardsTable.id, gameCard.id));

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
