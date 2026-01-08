# Observer Pattern

## Overview

The Observer Pattern decouples game events from their consumers. The game engine emits events without knowing who's listening - WebSocket, logging, analytics, or future systems can subscribe independently.

## Implementation

**Location**: `src/lib/game/game-event-emitter.ts`

```typescript
type EventListener = (event: GameEvent) => void | Promise<void>;

export class GameEventEmitter {
  private listeners: Map<GameEventType, Set<EventListener>> = new Map();

  on(eventType: GameEventType, listener: EventListener): () => void
  onAll(listener: EventListener): () => void
  off(eventType: GameEventType, listener: EventListener): void
  async emit(event: GameEvent): Promise<void>
  removeAllListeners(eventType?: GameEventType): void
  listenerCount(eventType: GameEventType): number
}
```

### Event Types

**Location**: `src/lib/game/game-event-types.ts`

| Event | When Emitted | Data |
|-------|--------------|------|
| `game_started` | Game session created | players array |
| `game_ended` | Win condition met | winnerId |
| `turn_started` | Turn begins | playerId, turnNumber, energy |
| `turn_ended` | Turn completes | playerId, turnNumber |
| `card_played` | Card moves to battlefield | cardId, cardName, energyCost |
| `card_drawn` | Card moves to hand | cardId, playerId |
| `attack_declared` | Creature attacks | attackerId, attackerPower, targetPlayerId |
| `damage_dealt` | Damage applied | amount, targetPlayerId, newHealth |
| `player_health_changed` | Life total changes | playerId, oldHealth, newHealth |
| `energy_changed` | Energy spent/gained | playerId, oldEnergy, newEnergy, maxEnergy |
| `phase_changed` | Game phase changes | newPhase |
| `game_state_updated` | Generic state update | gameId, currentTurn, phase |

### Event Interface

```typescript
export interface GameEvent {
  type: GameEventType;
  gameId: number;
  playerId?: number;
  data: Record<string, unknown>;
  timestamp: Date;
}
```

## Why This Pattern?

- **Decoupling** - Game engine doesn't import WebSocket code
- **Extensibility** - Add new listeners without changing game logic
- **Testability** - Test game logic without WebSocket connections
- **Single Responsibility** - Game engine focuses on rules, not delivery

## Benefits for This TCG

### 1. Game Logic Isolated from Transport
```typescript
// In GameEngine - just emits events, doesn't care about WebSocket
async playCard(gameId: number, playerId: number, cardId: number) {
  // ... game logic ...

  await gameEventEmitter.emit({
    type: 'card_played',
    gameId,
    playerId,
    data: { cardId, cardName: card.name, energyCost: card.energyCost },
    timestamp: new Date()
  });
}
```

### 2. Multiple Subscribers, No Code Changes
```typescript
// WebSocket broadcasts to players
gameEventEmitter.on('card_played', (event) => {
  gameRoomSocketManager.broadcastToRoom(roomId, {
    type: 'game_event',
    data: event
  });
});

// Logging (no WebSocket code changes needed)
gameEventEmitter.on('card_played', (event) => {
  logger.info('Card played', event.data);
});

// Future: Analytics
gameEventEmitter.on('card_played', (event) => {
  analytics.track('card_played', event);
});

// Future: AI opponent reaction
gameEventEmitter.on('card_played', (event) => {
  aiOpponent.reactToCardPlayed(event);
});
```

### 3. Subscribe to All Events
```typescript
// GameSocketManager subscribes to everything
const unsubscribe = gameEventEmitter.onAll(async (event) => {
  const roomId = await getRoomIdForGame(event.gameId);
  if (roomId) {
    gameRoomSocketManager.broadcastToRoom(roomId, {
      type: 'game_event',
      data: event,
      timestamp: new Date()
    });
  }
});

// Later: cleanup
unsubscribe();
```

## Real-time Communication Flow

```
GameEngine.attack()
  ↓
gameEventEmitter.emit({ type: 'attack_declared', ... })
  ↓
GameSocketManager listener receives event
  ↓
gameRoomSocketManager.broadcastToRoom()
  ↓
WebSocket.send() to all players in room
  ↓
Clients receive real-time update
```

## Server Performance Benefits

- **Push-based** - No polling, events sent immediately
- **Async listeners** - Non-blocking event handling via `Promise.all`
- **Unsubscribe support** - Cleanup prevents memory leaks
- **Error isolation** - One listener failure doesn't break others

```typescript
// Errors in listeners are caught individually
const promises = Array.from(eventListeners).map((listener) => {
  try {
    return Promise.resolve(listener(event));
  } catch (error) {
    console.error(`Error in event listener for ${event.type}:`, error);
    return Promise.resolve();
  }
});
await Promise.all(promises);
```

## Example: Full Attack Flow

```typescript
// 1. Player attacks via API
POST /game-sessions/123/actions
{ type: 'attack', data: { attackerId: 456 } }

// 2. GameEngine processes attack
const result = strategy.attack(creature.power);
opponent.lifeTotal -= result.damage;

// 3. Events emitted
await gameEventEmitter.emit({
  type: 'attack_declared',
  gameId: 123,
  playerId: 1,
  data: { attackerId: 456, attackerPower: 3, targetPlayerId: 2 },
  timestamp: new Date()
});

await gameEventEmitter.emit({
  type: 'damage_dealt',
  gameId: 123,
  data: { amount: 3, targetPlayerId: 2, newHealth: 17 },
  timestamp: new Date()
});

// 4. WebSocket listener broadcasts to both players
// 5. Clients update UI in real-time
```

## Global Instance (Singleton)

```typescript
// Exported singleton ensures all game components use same emitter
export const gameEventEmitter = new GameEventEmitter();
```

## Related Patterns

- **Singleton Pattern** - `gameEventEmitter` global instance
- **Strategy Pattern** - Attack strategies emit events through same emitter
