# Game Rooms and WebSocket System - Technical Guide

## Overview
The Game Rooms and WebSocket system provides the real-time multiplayer infrastructure for TCG Fuel. It handles player lobbies, real-time communication, and the transition from lobby to active game sessions. This system is crucial for creating an engaging multiplayer experience.

## Architecture

### Core Components
1. **Game Room Management** - Database-driven room system
2. **WebSocket Server** - Standalone WebSocket handling
3. **Event Broadcasting** - Real-time updates to connected clients
4. **Room State Management** - In-memory room state tracking
5. **Player Management** - Join, leave, and ready status handling

### System Architecture
```
Client ←→ WebSocket Server ←→ Game Room Manager ←→ Database
                ↓
        HTTP API (Room Info)
```

### Data Flow
```
Player Action → WebSocket → Event Handler → State Update → Broadcast → All Clients
```

## Database Schema

### Game Rooms Table (`game_rooms`)
```sql
CREATE TABLE game_rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' 
    CHECK (status IN ('waiting', 'in_progress', 'finished', 'cancelled')),
  max_players INTEGER NOT NULL DEFAULT 2,
  current_players INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER NOT NULL REFERENCES players(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Game Room Players Table (`game_room_players`)
```sql
CREATE TABLE game_room_players (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_ready TEXT NOT NULL DEFAULT 'not_ready' 
    CHECK (is_ready IN ('ready', 'not_ready')),
  deck_id INTEGER REFERENCES decks(id) ON DELETE SET NULL
);
```

## WebSocket System

### WebSocket Server Architecture
The WebSocket server runs independently from the HTTP server, providing dedicated real-time communication capabilities.

#### Server Setup
```typescript
class GameRoomWebSocketServer {
  private wss: WebSocketServer;
  private gameRoomSocketManager: GameRoomSocketManager;

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.gameRoomSocketManager = new GameRoomSocketManager();
    this.setupEventHandlers();
  }
}
```

#### Connection Management
- **Connection Tracking**: Maintain active WebSocket connections
- **Player Mapping**: Map connections to player IDs
- **Room Association**: Track which room each player is in
- **Cleanup**: Handle disconnections and cleanup

### Message Protocol

#### Message Structure
All WebSocket messages follow a discriminated union pattern:
```typescript
type WebSocketMessage = 
  | { type: 'join_room'; data: JoinRoomData }
  | { type: 'leave_room'; data: LeaveRoomData }
  | { type: 'ready_status'; data: ReadyStatusData }
  | { type: 'chat_message'; data: ChatMessageData }
  | { type: 'game_action'; data: GameActionData };
```

#### Client to Server Messages

##### Join Room
```json
{
  "type": "join_room",
  "data": {
    "roomId": 123,
    "playerId": 456,
    "deckId": 789
  }
}
```

##### Leave Room
```json
{
  "type": "leave_room",
  "data": {
    "roomId": 123,
    "playerId": 456
  }
}
```

##### Ready Status Update
```json
{
  "type": "ready_status",
  "data": {
    "roomId": 123,
    "playerId": 456,
    "isReady": "ready"
  }
}
```

##### Chat Message
```json
{
  "type": "chat_message",
  "data": {
    "roomId": 123,
    "playerId": 456,
    "message": "Hello everyone!"
  }
}
```

#### Server to Client Messages

##### Player Joined
```json
{
  "type": "player_joined",
  "data": {
    "roomId": 123,
    "player": {
      "id": 456,
      "username": "Player1",
      "isReady": "not_ready"
    }
  }
}
```

##### Player Left
```json
{
  "type": "player_left",
  "data": {
    "roomId": 123,
    "playerId": 456
  }
}
```

##### Ready Status Updated
```json
{
  "type": "ready_status_updated",
  "data": {
    "roomId": 123,
    "playerId": 456,
    "isReady": "ready"
  }
}
```

##### Game Started
```json
{
  "type": "game_started",
  "data": {
    "roomId": 123,
    "gameId": 789,
    "players": [...]
  }
}
```

## Game Room Management

### Room Lifecycle

#### 1. Room Creation
```typescript
// Create a new game room
const room = await db.insert(gameRoomsTable).values({
  name: 'Casual Game',
  maxPlayers: 4,
  createdBy: playerId,
  status: 'waiting'
});
```

#### 2. Player Joining
```typescript
// Player joins room
await db.insert(gameRoomPlayersTable).values({
  roomId: room.id,
  playerId: playerId,
  deckId: deckId,
  isReady: 'not_ready'
});

// Update room player count
await db.update(gameRoomsTable)
  .set({ currentPlayers: room.currentPlayers + 1 })
  .where(eq(gameRoomsTable.id, room.id));
```

#### 3. Ready Status Management
```typescript
// Update player ready status
await db.update(gameRoomPlayersTable)
  .set({ isReady: 'ready' })
  .where(and(
    eq(gameRoomPlayersTable.roomId, roomId),
    eq(gameRoomPlayersTable.playerId, playerId)
  ));
```

#### 4. Game Start
```typescript
// Check if all players are ready
const allReady = room.players.every(p => p.isReady === 'ready');
if (allReady && room.players.length >= 2) {
  // Start game session
  const gameSession = await gameEngine.createGameSession(room.id);
  
  // Update room status
  await db.update(gameRoomsTable)
    .set({ status: 'in_progress' })
    .where(eq(gameRoomsTable.id, room.id));
}
```

### Room State Management

#### In-Memory State
```typescript
class GameRoomSocketManager {
  private rooms: Map<number, RoomState> = new Map();
  
  private getRoomState(roomId: number): RoomState {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        players: new Map(),
        connections: new Map(),
        readyCount: 0
      });
    }
    return this.rooms.get(roomId)!;
  }
}
```

#### State Synchronization
- **Database First**: All state changes go through database
- **Memory Cache**: In-memory state for fast access
- **Event Broadcasting**: Real-time updates to all clients
- **State Recovery**: Rebuild memory state from database on restart

## API Endpoints

### Game Rooms HTTP API

#### GET `/game-rooms`
**Purpose**: List available game rooms
**Query Parameters**:
- `status`: Filter by room status
- `maxPlayers`: Filter by maximum players
- `page`: Pagination page
- `limit`: Items per page

**Response**:
```json
{
  "rooms": [
    {
      "id": 123,
      "name": "Casual Game",
      "status": "waiting",
      "maxPlayers": 4,
      "currentPlayers": 2,
      "createdBy": 456,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### POST `/game-rooms`
**Purpose**: Create a new game room
**Request Body**:
```json
{
  "name": "Tournament Practice",
  "maxPlayers": 2,
  "createdBy": 123
}
```

**Validation Rules**:
- `name`: Required, 1-100 characters
- `maxPlayers`: Required, 2-8 players
- `createdBy`: Must be valid player ID

#### GET `/game-rooms/:id`
**Purpose**: Get detailed room information
**Response**: Room details with player list

#### POST `/game-rooms/:id/join`
**Purpose**: Join a game room
**Request Body**:
```json
{
  "playerId": 123,
  "deckId": 456
}
```

#### POST `/game-rooms/:id/leave`
**Purpose**: Leave a game room
**Request Body**:
```json
{
  "playerId": 123
}
```

#### POST `/game-rooms/:id/ready`
**Purpose**: Update ready status
**Request Body**:
```json
{
  "playerId": 123,
  "isReady": "ready"
}
```

#### POST `/game-rooms/:id/start`
**Purpose**: Start the game (if all players ready)
**Request Body**:
```json
{
  "startedBy": 123
}
```

### Room Information Endpoints

#### GET `/game-rooms/:id/info`
**Purpose**: Get real-time room information for WebSocket clients
**Response**: Current room state, player list, ready status

#### GET `/game-rooms/info`
**Purpose**: Get information about all rooms player is in
**Query Parameters**: `playerId` (required)

## Event Handling

### WebSocket Event Handlers

#### Join Room Handler
```typescript
async handleJoinRoom(ws: WebSocket, data: JoinRoomData): Promise<void> {
  // Validate room exists and has space
  const room = await this.validateRoomJoin(data.roomId, data.playerId);
  
  // Add player to room
  await this.addPlayerToRoom(data.roomId, data.playerId, data.deckId);
  
  // Broadcast to all players in room
  this.broadcastToRoom(data.roomId, {
    type: 'player_joined',
    data: { roomId: data.roomId, player: playerData }
  });
  
  // Send room info to joining player
  this.sendToPlayer(ws, {
    type: 'room_info',
    data: { room: roomInfo }
  });
}
```

#### Leave Room Handler
```typescript
async handleLeaveRoom(ws: WebSocket, data: LeaveRoomData): Promise<void> {
  // Remove player from room
  await this.removePlayerFromRoom(data.roomId, data.playerId);
  
  // Broadcast to remaining players
  this.broadcastToRoom(data.roomId, {
    type: 'player_left',
    data: { roomId: data.roomId, playerId: data.playerId }
  });
  
  // Clean up if room is empty
  if (this.isRoomEmpty(data.roomId)) {
    await this.cleanupEmptyRoom(data.roomId);
  }
}
```

### Event Broadcasting

#### Room Broadcasting
```typescript
broadcastToRoom(roomId: number, message: WebSocketMessage): void {
  const roomState = this.getRoomState(roomId);
  
  for (const [playerId, connection] of roomState.connections) {
    if (connection.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify(message));
    }
  }
}
```

#### Player-Specific Messages
```typescript
sendToPlayer(ws: WebSocket, message: WebSocketMessage): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
```

## Error Handling

### WebSocket Error Types
- **Connection Errors**: Network issues, invalid connections
- **Message Errors**: Invalid message format, missing data
- **Business Logic Errors**: Invalid actions, room full, etc.
- **Authentication Errors**: Unauthorized access

### Error Response Format
```json
{
  "type": "error",
  "data": {
    "code": "ROOM_FULL",
    "message": "Room is at maximum capacity",
    "details": {
      "roomId": 123,
      "maxPlayers": 4,
      "currentPlayers": 4
    }
  }
}
```

### Error Handling Strategies
1. **Graceful Degradation**: Handle errors without crashing
2. **Client Notification**: Inform clients of errors
3. **Logging**: Record errors for debugging
4. **Recovery**: Attempt to recover from errors when possible

## Performance Considerations

### Connection Management
- **Connection Pooling**: Efficient WebSocket handling
- **Memory Management**: Clean up disconnected clients
- **Rate Limiting**: Prevent abuse and spam

### Broadcasting Optimization
- **Selective Broadcasting**: Only send relevant updates
- **Message Batching**: Group multiple updates when possible
- **Connection State Tracking**: Avoid sending to closed connections

### Database Optimization
- **Efficient Queries**: Optimize room and player queries
- **Connection Pooling**: Manage database connections
- **Caching**: Cache frequently accessed room data

## Security Features

### Authentication
- **Player Verification**: Validate player identity
- **Room Access Control**: Ensure players can only join allowed rooms
- **Action Validation**: Verify player permissions for actions

### Input Validation
- **Message Validation**: Validate all WebSocket messages
- **Data Sanitization**: Clean user input
- **Rate Limiting**: Prevent spam and abuse

### Resource Protection
- **Room Limits**: Prevent room overcrowding
- **Player Limits**: Enforce maximum player counts
- **Deck Validation**: Ensure valid deck selections

## Testing Strategy

### WebSocket Testing
- **Connection Testing**: Test WebSocket connections
- **Message Testing**: Test message handling and validation
- **Event Testing**: Test event broadcasting and handling

### Integration Testing
- **Room Lifecycle**: Test complete room creation to game start
- **Player Management**: Test join, leave, ready status
- **Error Scenarios**: Test error handling and recovery

### Load Testing
- **Connection Limits**: Test maximum concurrent connections
- **Room Capacity**: Test room performance with many players
- **Message Throughput**: Test message handling performance

## Monitoring and Debugging

### Connection Monitoring
- **Active Connections**: Track current WebSocket connections
- **Room Statistics**: Monitor room creation and usage
- **Performance Metrics**: Track response times and throughput

### Debug Tools
- **Message Logging**: Log all WebSocket messages
- **State Inspection**: Inspect room and player state
- **Connection Tracing**: Track connection lifecycle

### Health Checks
- **WebSocket Health**: Monitor WebSocket server status
- **Database Health**: Check database connectivity
- **Memory Usage**: Monitor memory consumption

## Future Enhancements

### Short Term
- **Room Chat**: Enhanced chat functionality
- **Player Kicking**: Room owner can remove players
- **Room Settings**: Customizable room rules

### Medium Term
- **Room Spectators**: Allow non-playing observers
- **Room Templates**: Pre-configured room types
- **Advanced Matchmaking**: Skill-based player matching

### Long Term
- **Cross-Server Rooms**: Multi-server room support
- **Room Persistence**: Persistent room configurations
- **Social Features**: Friend lists, room invitations

## Integration Points

### Game Engine
- **Game Start**: Trigger game session creation
- **Player Synchronization**: Sync player state between systems
- **Game Events**: Broadcast game state changes

### Authentication System
- **Player Verification**: Validate player identity and permissions
- **Session Management**: Handle player sessions and disconnections
- **Access Control**: Enforce room access rules

### Database System
- **Room Persistence**: Store room and player data
- **State Recovery**: Rebuild system state after restarts
- **Audit Logging**: Track room and player actions

---

*This document provides a comprehensive overview of the Game Rooms and WebSocket system. For implementation details, refer to the source code and API documentation.*
