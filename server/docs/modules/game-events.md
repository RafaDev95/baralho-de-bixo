# Game Events Module

## Overview

The Game Events module implements the **Observer Pattern** for decoupled event handling. Game logic emits events without knowing about WebSocket, UI, or other consumers.

## Key Components

### `GameEventEmitter`

Event emitter that implements the Observer pattern.

**Methods:**
- `on(eventType, listener)`: Subscribe to specific event
- `onAll(listener)`: Subscribe to all events
- `off(eventType, listener)`: Unsubscribe
- `emit(event)`: Emit event to all listeners
- `removeAllListeners(eventType?)`: Remove all listeners

### `GameEventTypes`

Type definitions for all game events.

## Design Pattern: Observer Pattern

### Why Observer Pattern?

**Before (Tight Coupling):**
```typescript
// Game engine directly calls WebSocket
class GameEngine {
  async playCard() {
    // Game logic
    await this.updateDatabase();
    // Direct WebSocket call - tight coupling!
    await websocket.broadcast({ type: 'card_played' });
  }
}
```

**Problems:**
- Game engine knows about WebSocket
- Hard to test (need WebSocket mock)
- Hard to add new consumers (logging, analytics)
- Violates Single Responsibility Principle

**After (Observer Pattern):**
```typescript
// Game engine just emits events
class GameEngine {
  async playCard() {
    // Game logic
    await this.updateDatabase();
    // Emit event - doesn't know who's listening
    await gameEventEmitter.emit({
      type: 'card_played',
      data: { cardId: 123 }
    });
  }
}

// WebSocket listens separately
gameEventEmitter.on('card_played', (event) => {
  websocket.broadcast(event);
});
```

### Benefits

1. **Decoupling**: Game logic doesn't know about consumers
2. **Extensibility**: Easy to add new listeners (logging, analytics, AI)
3. **Testability**: Test game logic without WebSocket
4. **Single Responsibility**: Each component has one job
5. **Flexibility**: Multiple listeners for same event

## Event Types

### Game Lifecycle
- `game_started`: Game session created
- `game_ended`: Game finished

### Turn Management
- `turn_started`: New turn begins
- `turn_ended`: Turn ends

### Card Actions
- `card_played`: Card played from hand
- `card_drawn`: Card drawn from deck

### Combat
- `attack_declared`: Creature attacks
- `damage_dealt`: Damage dealt to player

### State Changes
- `player_health_changed`: Health updated
- `energy_changed`: Energy updated
- `game_state_updated`: General state change

## Example Usage

```typescript
// Subscribe to specific event
gameEventEmitter.on('card_played', (event) => {
  console.log(`Card played: ${event.data.cardName}`);
});

// Subscribe to all events
gameEventEmitter.onAll((event) => {
  // Log all events
  logger.log(event);
});

// Emit event (from game engine)
await gameEventEmitter.emit({
  type: 'card_played',
  gameId: 123,
  playerId: 1,
  data: {
    cardId: 456,
    cardName: "Dragon",
    energyCost: 5
  },
  timestamp: new Date()
});
```

## Integration

- **Game Engine**: Emits events after actions
- **WebSocket Manager**: Listens and broadcasts
- **Future**: Analytics, logging, AI, replays

## Performance

- **Async Listeners**: All listeners execute in parallel
- **Error Handling**: Errors in one listener don't affect others
- **Memory Efficient**: Weak references could be added for cleanup

