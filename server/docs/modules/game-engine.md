# Game Engine Module

## Overview

The Game Engine is the core of the card battle game system. It manages game sessions, turn progression, action processing, and state management. The engine uses a streamlined turn structure and energy system for smooth browser performance.

## Responsibilities

1. **Game Session Management**: Create, manage, and end game sessions
2. **Turn Management**: Handle turn progression with phases (draw → play → end)
3. **Action Processing**: Validate and execute player actions (play card, attack, end turn)
4. **State Management**: Maintain in-memory game state and sync with database
5. **Event Emission**: Emit game events using Observer pattern for real-time updates

## Key Classes

### `GameEngine`

Main game engine class that orchestrates all game logic.

**Key Methods:**
- `createGameSession(roomId)`: Create a new game from a ready room
- `processGameAction(gameId, action)`: Process a player action
- `getGameState(gameId)`: Get current game state
- `endGameSession(gameId, winnerId)`: End a game session

## Design Patterns Used

### Observer Pattern
The game engine emits events through `gameEventEmitter` for:
- Game started/ended
- Turn started/ended
- Card played
- Attack declared
- Damage dealt
- Energy changed
- Health changed

This decouples game logic from WebSocket/UI updates.

## Game Flow

1. **Game Creation**: Room → Game Session → Initialize Decks → Draw Starting Hands
2. **Turn Structure**: 
   - Draw phase: Draw 1 card, gain energy
   - Play phase: Play cards, attack
   - End phase: End turn, pass to opponent
3. **Action Processing**: Validate → Execute → Update State → Emit Events

## State Management

- **In-Memory**: Fast access during gameplay
- **Database**: Persistence for recovery and history
- **Snapshots**: Periodic state snapshots for replay

## Integration Points

- **Energy System**: Manages player energy resources
- **Event Emitter**: Broadcasts game events
- **WebSocket Manager**: Connects events to real-time updates
- **Database**: Persists game state and actions

## Example Usage

```typescript
// Create a game session
const gameSession = await gameEngine.createGameSession(roomId);

// Process a player action
await gameEngine.processGameAction(gameId, {
  type: 'play_card',
  playerId: 1,
  data: { cardId: 123 }
});

// Get current game state
const state = gameEngine.getGameState(gameId);
```

