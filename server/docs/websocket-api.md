# WebSocket API Documentation

## Overview

The TCG Game Rooms WebSocket API provides real-time communication for game lobbies. Players can join rooms, update their ready status, send chat messages, and receive live updates about room events.

## Connection

**WebSocket URL:** `ws://localhost:8081`

Connect to the WebSocket server to start receiving real-time updates.

## Message Format

All messages are JSON objects with the following structure:

```json
{
  "type": "message_type",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Client to Server Messages

### Join Room

Join a specific game room.

```json
{
  "type": "join_room",
  "roomId": 1,
  "playerId": 123
}
```

**Response:** `connected` event with socket ID and room information.

### Update Ready Status

Update your ready status in the room.

```json
{
  "type": "ready_status",
  "isReady": true
}
```

**Response:** `ready_status_changed` event broadcast to all players in the room.

### Send Chat Message

Send a chat message to all players in the room.

```json
{
  "type": "chat_message",
  "message": "Hello, everyone!"
}
```

**Response:** `chat_message` event broadcast to all players in the room.

### Leave Room

Leave the current room.

```json
{
  "type": "leave_room"
}
```

**Response:** `player_left` event broadcast to remaining players in the room.

## Server to Client Events

### Connected

Sent when successfully joining a room.

```json
{
  "type": "connected",
  "data": {
    "roomId": 1,
    "playerId": 123,
    "socketId": "1-123-1704067200000"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Player Joined

Sent when a new player joins the room.

```json
{
  "type": "player_joined",
  "data": {
    "playerId": 456,
    "roomId": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Player Left

Sent when a player leaves the room.

```json
{
  "type": "player_left",
  "data": {
    "playerId": 456,
    "roomId": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Ready Status Changed

Sent when a player updates their ready status.

```json
{
  "type": "ready_status_changed",
  "data": {
    "playerId": 123,
    "isReady": true,
    "roomId": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Chat Message

Sent when a player sends a chat message.

```json
{
  "type": "chat_message",
  "data": {
    "playerId": 123,
    "message": "Hello, everyone!",
    "roomId": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Game Started

Sent when the game starts (when all players are ready).

```json
{
  "type": "game_started",
  "data": {
    "roomId": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error

Sent when an error occurs.

```json
{
  "type": "error",
  "data": {
    "message": "Invalid message format"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## HTTP Endpoints

### Get Room Info

Get information about a specific room.

```
GET /game-rooms/{roomId}/info
```

**Response:**
```json
{
  "roomId": 1,
  "playerCount": 2,
  "players": [
    {
      "playerId": 123,
      "isReady": true
    },
    {
      "playerId": 456,
      "isReady": false
    }
  ]
}
```

### Get All Rooms Info

Get information about all active rooms.

```
GET /game-rooms/info
```

**Response:**
```json
[
  {
    "roomId": 1,
    "playerCount": 2,
    "players": [...]
  },
  {
    "roomId": 2,
    "playerCount": 1,
    "players": [...]
  }
]
```

## Usage Example

Here's a simple JavaScript example of how to use the WebSocket API:

```javascript
const ws = new WebSocket('ws://localhost:8081');

ws.onopen = function() {
  console.log('Connected to WebSocket server');
  
  // Join room
  ws.send(JSON.stringify({
    type: 'join_room',
    roomId: 1,
    playerId: 123
  }));
};

ws.onmessage = function(event) {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'connected':
      console.log('Joined room:', message.data.roomId);
      break;
      
    case 'player_joined':
      console.log('Player joined:', message.data.playerId);
      break;
      
    case 'ready_status_changed':
      console.log('Player ready status changed:', message.data);
      break;
      
    case 'chat_message':
      console.log('Chat:', message.data.playerId, ':', message.data.message);
      break;
  }
};

// Update ready status
ws.send(JSON.stringify({
  type: 'ready_status',
  isReady: true
}));

// Send chat message
ws.send(JSON.stringify({
  type: 'chat_message',
  message: 'Hello, everyone!'
}));

// Leave room
ws.send(JSON.stringify({
  type: 'leave_room'
}));
```

## Error Handling

- Always handle WebSocket connection errors
- Validate message format before sending
- Handle disconnection gracefully
- Implement reconnection logic for production use

## Security Considerations

- Validate player IDs and room IDs on the server
- Implement authentication for production use
- Rate limit message sending
- Sanitize chat messages to prevent XSS

## Testing

Use the provided HTML client example (`examples/websocket-client.html`) to test the WebSocket functionality interactively. 