# WebSocket Integration Module

## Overview

The WebSocket Integration module connects game events (Observer pattern) to real-time WebSocket broadcasts. This enables push-based updates instead of client polling, significantly improving browser performance.

## Architecture

```
Game Engine → Event Emitter → Game Socket Manager → WebSocket Server → Clients
```

## Key Components

### `GameSocketManager`

Maps game sessions to rooms and broadcasts game events to connected players.

**Responsibilities:**
- Register/unregister game sessions
- Map game IDs to room IDs
- Listen to game events and broadcast via WebSocket

### `GameRoomSocketManager`

Manages WebSocket connections for game rooms.

**Responsibilities:**
- Track active connections
- Broadcast messages to room players
- Handle connection/disconnection

## Design Pattern: Observer Pattern Integration

The WebSocket integration uses the Observer pattern to decouple game logic from real-time updates:

```typescript
// Game engine emits events (doesn't know about WebSocket)
gameEventEmitter.emit({
  type: 'card_played',
  gameId: 123,
  data: { cardId: 456 }
});

// Game socket manager listens and broadcasts
gameSocketManager.setupGameEventListeners();
// Automatically broadcasts to all players in the game's room
```

## Benefits

### WebSocket Push Updates
- Server pushes updates immediately
- Low latency (< 100ms)
- Efficient bandwidth usage
- Reduced server load
- No race conditions

## Event Flow

1. **Game Action**: Player plays card
2. **Game Engine**: Processes action, emits event
3. **Event Emitter**: Notifies all listeners
4. **Socket Manager**: Receives event, finds room
5. **WebSocket**: Broadcasts to all players in room
6. **Clients**: Receive real-time update

## Message Format

```typescript
{
  type: 'game_event',
  data: {
    type: 'card_played',
    gameId: 123,
    playerId: 1,
    data: { cardId: 456, cardName: "Dragon" },
    timestamp: "2024-01-01T00:00:00Z"
  },
  timestamp: "2024-01-01T00:00:00Z"
}
```

## Supported Events

All game events are automatically broadcast:
- `game_started`
- `game_ended`
- `turn_started`
- `card_played`
- `attack_declared`
- `damage_dealt`
- `player_health_changed`
- `energy_changed`
- `game_state_updated`

## Example Usage

```typescript
// Register game with socket manager
await gameSocketManager.registerGame(gameId, roomId);

// Game events are automatically broadcast
// No additional code needed in game engine
```

## Performance Considerations

- **Connection Management**: Efficient socket tracking
- **Event Filtering**: Clients can filter events by type
- **Error Handling**: Graceful handling of disconnected clients
- **Scalability**: Can be extended for multiple game servers

