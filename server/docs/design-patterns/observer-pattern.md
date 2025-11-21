# Observer Pattern

## Overview

The Observer Pattern decouples game events from their consumers (WebSocket, UI, logging, etc.). The game engine emits events without knowing who's listening.

## Implementation

**Location**: `server/src/lib/game/game-event-emitter.ts`

```typescript
class GameEventEmitter {
  on(eventType, listener): unsubscribe
  onAll(listener): unsubscribe
  off(eventType, listener): void
  emit(event): Promise<void>
}
```

## Why This Pattern?

The Observer Pattern provides:
- Decoupled game logic from consumers
- Easy to add new listeners
- Testable game logic without WebSocket
- Single Responsibility Principle

## Benefits for Our Game

1. **Decoupling**: Game logic independent of consumers
2. **Extensibility**: Easy to add new listeners (analytics, AI, replays)
3. **Testability**: Test game logic without WebSocket
4. **Single Responsibility**: Each component has one job
5. **Real-time Updates**: Enables push-based updates (no polling)

## Browser Performance Impact

### Observer + WebSocket
- Server pushes immediately
- < 100ms latency
- Efficient bandwidth (It doesn't affect bandwidth directly but, if we have LESS latency the communication should be faster and smoother and consuming less bandwidth)
- Lower server load

## Example

```typescript
// Game engine emits events
await gameEventEmitter.emit({
  type: 'card_played',
  gameId: 123,
  playerId: 1,
  data: { cardId: 456 },
  timestamp: new Date()
});

// Multiple listeners can react
gameEventEmitter.on('card_played', (event) => {
  // WebSocket broadcasts to clients
  websocket.broadcast(event);
});

gameEventEmitter.on('card_played', (event) => {
  // Analytics tracks the event
  analytics.track('card_played', event);
});

gameEventEmitter.on('card_played', (event) => {
  // Logger records the event
  logger.info('Card played', event);
});
```

## Integration with WebSocket

The Observer pattern enables real-time updates:

```typescript
// Game socket manager listens to all events
gameEventEmitter.onAll(async (event) => {
  const roomId = await getRoomIdForGame(event.gameId);
  if (roomId) {
    // Broadcast to all players in room
    gameRoomSocketManager.broadcastToRoom(roomId, {
      type: 'game_event',
      data: event,
      timestamp: new Date()
    });
  }
});
```

## Performance Benefits

- **No Polling**: Push-based updates
- **Lower Latency**: Immediate updates
- **Less Bandwidth**: Only send when needed
- **Scalable**: Easy to add more listeners

