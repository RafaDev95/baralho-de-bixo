# Singleton Pattern

## Overview

The Singleton Pattern ensures a class has only one instance with global access. This TCG uses module-level singletons for core services that must maintain consistent state across the application: game engine, event emitter, and WebSocket managers.

## Implementation

### Module-Level Singletons

TypeScript/JavaScript modules are evaluated once, making exported instances natural singletons.

**Game Engine**
```typescript
// src/lib/game/game-engine-simple.ts:760
export const gameEngine = new GameEngine();
```

**Event Emitter**
```typescript
// src/lib/game/game-event-emitter.ts:125
export const gameEventEmitter = new GameEventEmitter();
```

**WebSocket Managers**
```typescript
// src/lib/websocket/game-room-socket.ts:212
export const gameRoomSocketManager = new GameRoomSocketManager();

// src/lib/websocket/game-socket-manager.ts:99
export const gameSocketManager = new GameSocketManager();

// src/lib/websocket/websocket-server.ts:141
export const gameRoomWebSocketServer = new GameRoomWebSocketServer();
```

## Singleton Instances

| Instance | Location | Purpose |
|----------|----------|---------|
| `gameEngine` | `lib/game/game-engine-simple.ts` | Process game actions, manage game state |
| `gameEventEmitter` | `lib/game/game-event-emitter.ts` | Broadcast events to all listeners |
| `gameRoomSocketManager` | `lib/websocket/game-room-socket.ts` | Manage WebSocket rooms and connections |
| `gameSocketManager` | `lib/websocket/game-socket-manager.ts` | Bridge game events to WebSocket |
| `gameRoomWebSocketServer` | `lib/websocket/websocket-server.ts` | WebSocket server instance |

## Why This Pattern?

- **Shared state** - All modules access same game engine
- **Consistent behavior** - Single event emitter for all events
- **Memory efficiency** - One instance instead of many
- **Simplified access** - Import and use, no dependency injection needed

## Benefits for This TCG

### 1. Shared Game State
```typescript
// In game-sessions handler
import { gameEngine } from '@/lib/game/game-engine-simple';

// Process action
await gameEngine.processGameAction(gameId, playerId, action);

// In another module - same instance, same state
import { gameEngine } from '@/lib/game/game-engine-simple';
const state = await gameEngine.getGameState(gameId);
```

### 2. All Events Go Through One Emitter
```typescript
// Game engine emits events
import { gameEventEmitter } from '@/lib/game/game-event-emitter';

await gameEventEmitter.emit({
  type: 'card_played',
  gameId,
  data: { cardId, cardName }
});

// WebSocket manager listens - same emitter instance
import { gameEventEmitter } from '@/lib/game/game-event-emitter';

gameEventEmitter.onAll((event) => {
  // Receives all events from game engine
  broadcast(event);
});
```

### 3. WebSocket Room Management
```typescript
// Player joins room
import { gameRoomSocketManager } from '@/lib/websocket/game-room-socket';
gameRoomSocketManager.addPlayerToRoom(roomId, playerId, ws);

// Game broadcasts to room - same instance
import { gameRoomSocketManager } from '@/lib/websocket/game-room-socket';
gameRoomSocketManager.broadcastToRoom(roomId, message);
```

## Implementation Pattern

```typescript
// Pattern: Export instance at module level
class GameEngine {
  private games: Map<number, GameState> = new Map();

  async createGameSession(roomId: number): Promise<GameState> {
    // ...
  }

  async processGameAction(gameId: number, playerId: number, action: GameAction) {
    // ...
  }
}

// Single instance created on first import
export const gameEngine = new GameEngine();
```

## Usage

```typescript
// Import the singleton (not the class)
import { gameEngine } from '@/lib/game/game-engine-simple';
import { gameEventEmitter } from '@/lib/game/game-event-emitter';
import { gameRoomSocketManager } from '@/lib/websocket/game-room-socket';

// Use directly
await gameEngine.processGameAction(gameId, playerId, action);

// Subscribe to events
const unsubscribe = gameEventEmitter.on('game_started', handler);

// Broadcast to room
gameRoomSocketManager.broadcastToRoom(roomId, message);
```

## Testing Considerations

Singletons can make testing harder due to shared state. Solutions used:

### 1. Reset Methods
```typescript
// GameEventEmitter has removeAllListeners()
gameEventEmitter.removeAllListeners();
```

### 2. Isolated Test Databases
```typescript
// Tests use testcontainers for fresh database
// Game state doesn't persist between test runs
```

### 3. Test-Specific Instances (if needed)
```typescript
// For unit tests, create new instance
const testEmitter = new GameEventEmitter();
```

## Why Not Dependency Injection?

For this project, module singletons are simpler:

| Approach | Pros | Cons |
|----------|------|------|
| **Module Singleton** | Simple, no DI framework needed | Harder to mock |
| **Dependency Injection** | Easier testing, explicit dependencies | More boilerplate, DI container needed |

Module singletons work well here because:
- Small codebase
- Single server instance
- Integration tests use testcontainers (not mocks)
- Services have clear, stable interfaces

## Related Patterns

- **Observer Pattern** - `gameEventEmitter` singleton enables global event bus
- **Registry Pattern** - `AttackStrategyFactory` uses static Map (class-level singleton)
