# Game Engine and Mana System - Technical Guide

## Overview
The Game Engine and Mana System form the core gameplay mechanics of TCG Fuel. The Game Engine manages game sessions, turn structure, and action processing, while the Mana System handles resource management for casting spells and playing cards. Together, they provide the foundation for all card game interactions.

## Game Engine Architecture

### Core Components
1. **Game Session Management** - Game lifecycle and state persistence
2. **Turn Management** - Player turns, phases, and steps
3. **Action Processing** - Card plays, game actions, and validation
4. **State Management** - In-memory and database state synchronization
5. **Game Rules Engine** - Core game logic and rule enforcement

### System Architecture
```
Game Engine ←→ Database ←→ Game State Snapshots
     ↓
Action Processing ←→ Mana System ←→ Card Validation
     ↓
Turn Management ←→ Phase/Step System
```

### Data Flow
```
Player Action → Action Validation → Mana Check → Action Execution → State Update → Turn Advancement
```

## Database Schema

### Game Sessions Table (`game_sessions`)
```sql
CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES game_rooms(id),
  status TEXT NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'finished', 'cancelled')),
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMP,
  winner_id INTEGER REFERENCES players(id),
  current_turn INTEGER NOT NULL DEFAULT 1,
  current_player_index INTEGER NOT NULL DEFAULT 0,
  phase TEXT NOT NULL DEFAULT 'untap' 
    CHECK (phase IN ('untap', 'upkeep', 'draw', 'main1', 'combat', 'main2', 'end')),
  step TEXT NOT NULL DEFAULT 'beginning' 
    CHECK (step IN ('beginning', 'declare_attackers', 'declare_blockers', 'combat_damage', 'end')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Game Players Table (`game_players`)
```sql
CREATE TABLE game_players (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_id INTEGER NOT NULL REFERENCES players(id),
  deck_id INTEGER REFERENCES decks(id),
  player_index INTEGER NOT NULL,
  life_total INTEGER NOT NULL DEFAULT 20,
  hand_size INTEGER NOT NULL DEFAULT 0,
  deck_size INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Game Cards Table (`game_cards`)
```sql
CREATE TABLE game_cards (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  card_id INTEGER REFERENCES cards(id),
  owner_id INTEGER NOT NULL REFERENCES players(id),
  controller_id INTEGER NOT NULL REFERENCES players(id),
  location TEXT NOT NULL 
    CHECK (location IN ('deck', 'hand', 'battlefield', 'graveyard', 'exile', 'stack')),
  zone_index INTEGER NOT NULL DEFAULT 0,
  power INTEGER,
  toughness INTEGER,
  is_tapped BOOLEAN DEFAULT false,
  attached_to INTEGER REFERENCES game_cards(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Game Actions Table (`game_actions`)
```sql
CREATE TABLE game_actions (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_id INTEGER NOT NULL REFERENCES players(id),
  action_type TEXT NOT NULL 
    CHECK (action_type IN ('play_card', 'end_turn', 'draw_card', 'attack', 'block')),
  action_data JSONB,
  turn_number INTEGER NOT NULL,
  phase TEXT NOT NULL,
  step TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Game State Snapshots Table (`game_state_snapshots`)
```sql
CREATE TABLE game_state_snapshots (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  turn_number INTEGER NOT NULL,
  phase TEXT NOT NULL,
  step TEXT NOT NULL,
  game_state JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Game Engine Implementation

### Game Engine Class
```typescript
export class GameEngine {
  private gameState: Map<number, GameState> = new Map();

  // Core methods
  async createGameSession(roomId: number): Promise<GameSession>;
  async processGameAction(gameId: number, action: GameAction): Promise<void>;
  async endTurn(gameId: number): Promise<void>;
  async playCard(gameId: number, action: GameAction): Promise<void>;
  getGameState(gameId: number): GameState | undefined;
  async endGameSession(gameId: number, winnerId?: number): Promise<void>;
}
```

### Game State Interface
```typescript
export interface GameState {
  gameId: number;
  currentTurn: number;
  currentPlayerIndex: number;
  phase: GamePhase;
  step: GameStep;
  players: GamePlayer[];
  cards: GameCard[];
}
```

### Game Action Interface
```typescript
export interface GameAction {
  type: ActionType;
  playerId: number;
  data?: Record<string, unknown>;
}
```

## Game Session Lifecycle

### 1. Game Creation
```typescript
async createGameSession(roomId: number): Promise<GameSession> {
  // Get room information
  const room = await db.query.gameRoomsTable.findFirst({
    where: eq(gameRoomsTable.id, roomId),
    with: { players: true }
  });

  // Validate room state
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
    const gamePlayers = await this.initializeGamePlayers(tx, gameSession.id, room.players);

    // Initialize player decks and hands
    await this.initializePlayerDecks(tx, gameSession.id, gamePlayers);

    // Update room status
    await tx
      .update(gameRoomsTable)
      .set({ status: 'in_progress' })
      .where(eq(gameRoomsTable.id, roomId));

    // Create initial game state
    const gameState = this.createInitialGameState(gameSession.id, gamePlayers);
    this.gameState.set(gameSession.id, gameState);

    // Create initial snapshot
    await this.createGameSnapshot(tx, gameSession.id, gameState);

    return gameSession;
  });
}
```

### 2. Deck Initialization
```typescript
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
      with: { card: true }
    });

    // Create game cards for deck
    const gameCardsData = deckCardsResult.map((deckCard, index) => ({
      gameId,
      cardId: deckCard.cardId,
      ownerId: gamePlayer.playerId,
      controllerId: gamePlayer.playerId,
      location: 'deck' as const,
      zoneIndex: index,
      power: deckCard.card?.power ?? 0,
      toughness: deckCard.card?.toughness ?? 0,
    }));

    // Insert deck cards
    await tx.insert(gameCardsTable).values(gameCardsData);

    // Draw starting hand (7 cards)
    await this.drawCards(tx, gameId, gamePlayer.playerId, 7);
  }
}
```

### 3. Action Processing
```typescript
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
```

## Turn Management

### Turn Structure
The game follows a structured turn system with phases and steps:

#### Phases
1. **Untap Phase** - Untap permanents, generate mana
2. **Upkeep Phase** - Upkeep effects, draw step triggers
3. **Draw Phase** - Draw a card
4. **Main Phase 1** - Play cards, activate abilities
5. **Combat Phase** - Combat sequence
6. **Main Phase 2** - Additional card plays
7. **End Phase** - End of turn effects

#### Steps (Combat Phase)
1. **Beginning of Combat** - Combat triggers
2. **Declare Attackers** - Choose attacking creatures
3. **Declare Blockers** - Choose blocking creatures
4. **Combat Damage** - Resolve damage
5. **End of Combat** - Combat cleanup

### Turn Advancement
```typescript
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

  // Untap mana sources for the new player
  const newPlayer = gameState.players[gameState.currentPlayerIndex];
  await ManaSystem.untapManaSources(gameId, newPlayer.playerId);

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
```

## Action Processing

### Action Types
```typescript
export type ActionType = 
  | 'play_card'      // Play a card from hand
  | 'end_turn'       // End current turn
  | 'draw_card'      // Draw a card
  | 'attack'         // Declare attackers
  | 'block'          // Declare blockers
  | 'activate_ability'; // Activate card ability
```

### Action Validation
```typescript
private isValidAction(gameState: GameState, action: GameAction): boolean {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  // Only current player can take actions
  if (action.playerId !== currentPlayer.playerId) {
    return false;
  }

  // Check if action is valid for current phase/step
  switch (action.type) {
    case 'play_card':
      return this.canPlayCardInPhase(gameState.phase, gameState.step);
    case 'attack':
      return gameState.phase === 'combat' && gameState.step === 'declare_attackers';
    case 'block':
      return gameState.phase === 'combat' && gameState.step === 'declare_blockers';
    default:
      return true;
  }
}
```

### Card Playing
```typescript
private async playCard(
  tx: Transaction,
  gameId: number,
  action: GameAction
): Promise<void> {
  const cardData = action.data as { cardId: number; targetId?: number };
  if (!cardData?.cardId) {
    throw new Error('Card ID is required to play a card');
  }

  // Validate mana cost using ManaSystem
  const canPlay = await ManaSystem.canPlayCard(
    gameId,
    action.playerId,
    cardData.cardId
  );
  if (!canPlay.canPlay) {
    throw new Error(`Cannot play card: ${canPlay.reason}`);
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

  // Pay the mana cost and tap sources
  const playResult = await ManaSystem.playCard(
    gameId,
    action.playerId,
    cardData.cardId
  );
  if (!playResult.success) {
    throw new Error(`Failed to play card: ${playResult.reason}`);
  }

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
    .set({ handSize: -1 })
    .where(
      and(
        eq(gamePlayersTable.gameId, gameId),
        eq(gamePlayersTable.playerId, action.playerId)
      )
    );
}
```

## Mana System

### Core Concepts
The Mana System manages the resource economy of the game, allowing players to cast spells and activate abilities.

#### Mana Types
```typescript
export type ManaType = 'red' | 'blue' | 'green' | 'white' | 'black' | 'generic';
```

#### Mana Pool
```typescript
export interface ManaPool {
  red: number;
  blue: number;
  green: number;
  white: number;
  black: number;
  generic: number;
}
```

#### Mana Cost
```typescript
export interface ManaCost {
  red?: number;
  blue?: number;
  green?: number;
  white?: number;
  black?: number;
  generic?: number;
}
```

### Mana System Implementation

#### Core Methods
```typescript
export class ManaSystem {
  // Mana pool management
  static createEmptyManaPool(): ManaPool;
  static addMana(pool: ManaPool, type: ManaType, amount: number): ManaPool;
  static removeMana(pool: ManaPool, type: ManaType, amount: number): ManaPool;

  // Mana cost validation and payment
  static canPayManaCost(pool: ManaPool, cost: ManaCost): boolean;
  static payManaCost(pool: ManaPool, cost: ManaCost): { newPool: ManaPool; usedMana: ManaCost };

  // Game integration
  static async getAvailableMana(gameId: number, playerId: number): Promise<ManaPool>;
  static async canPlayCard(gameId: number, playerId: number, cardId: number): Promise<{ canPlay: boolean; reason?: string }>;
  static async playCard(gameId: number, playerId: number, cardId: number): Promise<{ success: boolean; reason?: string; usedMana?: ManaCost }>;
  static async untapManaSources(gameId: number, playerId: number): Promise<void>;
}
```

#### Mana Pool Management
```typescript
static createEmptyManaPool(): ManaPool {
  return {
    red: 0,
    blue: 0,
    green: 0,
    white: 0,
    black: 0,
    generic: 0,
  };
}

static addMana(pool: ManaPool, type: ManaType, amount: number): ManaPool {
  return {
    ...pool,
    [type]: pool[type] + amount,
  };
}

static removeMana(pool: ManaPool, type: ManaType, amount: number): ManaPool {
  const current = pool[type];
  const newAmount = Math.max(0, current - amount);
  return {
    ...pool,
    [type]: newAmount,
  };
}
```

#### Mana Cost Validation
```typescript
static canPayManaCost(pool: ManaPool, cost: ManaCost): boolean {
  // Check colored mana requirements first
  for (const [color, amount] of Object.entries(cost)) {
    if (color === 'generic') continue;

    const manaType = color as ManaType;
    if (pool[manaType] < (amount || 0)) {
      return false;
    }
  }

  // Check if we have enough total mana (including generic)
  const totalRequired = Object.values(cost).reduce(
    (sum, amount) => sum + (amount || 0),
    0
  );
  const totalAvailable = Object.values(pool).reduce(
    (sum, amount) => sum + amount,
    0
  );

  return totalAvailable >= totalRequired;
}
```

#### Mana Cost Payment
```typescript
static payManaCost(
  pool: ManaPool,
  cost: ManaCost
): { newPool: ManaPool; usedMana: ManaCost } {
  const newPool = { ...pool };
  const usedMana: ManaCost = {};

  // Pay colored mana costs first
  for (const [color, amount] of Object.entries(cost)) {
    if (color === 'generic') continue;

    const manaType = color as ManaType;
    const costAmount = amount || 0;
    const available = newPool[manaType];
    const used = Math.min(available, costAmount);

    newPool[manaType] -= used;
    usedMana[manaType] = used;
  }

  // Pay generic mana costs with remaining mana
  const genericCost = cost.generic || 0;
  let genericPaid = 0;

  // Try to pay with colored mana first (in order of preference)
  const colorOrder: ManaType[] = ['red', 'blue', 'green', 'white', 'black'];

  for (const color of colorOrder) {
    if (genericPaid >= genericCost) break;

    const available = newPool[color];
    const needed = genericCost - genericPaid;
    const used = Math.min(available, needed);

    newPool[color] -= used;
    genericPaid += used;
  }

  usedMana.generic = genericPaid;

  return { newPool, usedMana };
}
```

### Mana Sources

#### Land Detection
```typescript
static getLandManaType(cardName: string): ManaType | null {
  const name = cardName.toLowerCase();

  if (name.includes('mountain')) return 'red';
  if (name.includes('island')) return 'blue';
  if (name.includes('forest')) return 'green';
  if (name.includes('plains')) return 'white';
  if (name.includes('swamp')) return 'black';

  return null;
}
```

#### Mana Source Management
```typescript
static async getPlayerManaSources(gameId: number, playerId: number): Promise<ManaSource[]> {
  const lands = await db
    .select()
    .from(gameCardsTable)
    .where(
      and(
        eq(gameCardsTable.gameId, gameId),
        eq(gameCardsTable.ownerId, playerId),
        eq(gameCardsTable.location, 'battlefield')
      )
    );

  const manaSources: ManaSource[] = [];

  for (const land of lands) {
    // Check if it's a land card and get its mana type
    const card = await db.query.cardsTable.findFirst({
      where: eq(db.query.cardsTable.id, land.cardId),
    });

    if (card && card.type === 'artifact') {
      // For now, assume basic lands (stored as artifacts) produce 1 mana of their color
      const manaType = ManaSystem.getLandManaType(card.name);
      if (manaType) {
        manaSources.push({
          cardId: land.id,
          type: manaType,
          amount: 1,
          isTapped: land.isTapped || false,
        });
      }
    }
  }

  return manaSources;
}
```

## State Management

### In-Memory State
The Game Engine maintains game state in memory for fast access during gameplay:

```typescript
private gameState: Map<number, GameState> = new Map();
```

### State Persistence
Game state is persisted to the database through:
- **Game Actions**: Every action is logged with full context
- **State Snapshots**: Periodic state snapshots for recovery
- **Real-time Updates**: Database updates for critical state changes

### State Recovery
```typescript
async recoverGameState(gameId: number): Promise<GameState> {
  // Get latest snapshot
  const snapshot = await db.query.gameStateSnapshotsTable.findFirst({
    where: eq(gameStateSnapshotsTable.gameId, gameId),
    orderBy: [desc(gameStateSnapshotsTable.createdAt)]
  });

  if (snapshot) {
    return snapshot.gameState as GameState;
  }

  // Fallback: rebuild from actions
  return this.rebuildGameStateFromActions(gameId);
}
```

## Performance Considerations

### Memory Management
- **Game State Caching**: Active games cached in memory
- **Lazy Loading**: Load card details only when needed
- **Garbage Collection**: Clean up finished games

### Database Optimization
- **Batch Operations**: Group database operations
- **Indexing**: Optimize queries on game state
- **Connection Pooling**: Efficient database connections

### Action Processing
- **Validation Caching**: Cache validation results
- **Parallel Processing**: Process independent actions concurrently
- **Rate Limiting**: Prevent action spam

## Security Features

### Game Integrity
- **Action Validation**: Server-side validation of all actions
- **State Verification**: Verify game state consistency
- **Anti-Cheat**: Detect and prevent cheating attempts

### Access Control
- **Player Verification**: Ensure actions come from valid players
- **Turn Enforcement**: Only current player can act
- **Resource Validation**: Verify mana costs and card availability

## Testing Strategy

### Unit Tests
- **Game Engine**: Test core game logic
- **Mana System**: Test mana calculations and validation
- **Action Processing**: Test action validation and execution

### Integration Tests
- **Game Sessions**: Test complete game lifecycle
- **Database Integration**: Test state persistence
- **WebSocket Integration**: Test real-time updates

### Game Logic Tests
- **Turn Management**: Test phase and step progression
- **Card Interactions**: Test card playing and effects
- **Win Conditions**: Test game ending scenarios

## Future Enhancements

### Short Term
- **Advanced Card Types**: Planeswalkers, tribal cards
- **Stack System**: Spell resolution and counterspells
- **Combat System**: Detailed combat mechanics

### Medium Term
- **Card Abilities**: Activated and triggered abilities
- **Enchantment System**: Auras and global effects
- **Artifact System**: Equipment and artifact abilities

### Long Term
- **Multiplayer Support**: More than 2 players
- **Tournament System**: Organized play support
- **AI Opponents**: Computer-controlled players

## Integration Points

### WebSocket System
- **Game Events**: Broadcast game state changes
- **Player Actions**: Receive and process player actions
- **Real-time Updates**: Live game state synchronization

### Database System
- **State Persistence**: Store game state and actions
- **Recovery**: Rebuild game state after restarts
- **Analytics**: Track game statistics and performance

### Authentication System
- **Player Verification**: Validate player identity
- **Game Access**: Control access to game sessions
- **Audit Logging**: Track all game actions

---

*This document provides a comprehensive overview of the Game Engine and Mana System. For implementation details, refer to the source code and API documentation.*
