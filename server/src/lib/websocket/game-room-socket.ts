import type { WebSocket } from 'ws';

export interface GameRoomSocket {
  id: string;
  roomId: number;
  playerId: number;
  ws: WebSocket;
  isReady: boolean;
}

export interface GameRoomEvent {
  type:
    | 'player_joined'
    | 'player_left'
    | 'ready_status_changed'
    | 'game_started'
    | 'game_event'
    | 'chat_message'
    | 'connected';
  data: Record<string, unknown>;
  timestamp: Date;
}

class GameRoomSocketManager {
  private rooms: Map<number, Set<GameRoomSocket>> = new Map();
  private sockets: Map<string, GameRoomSocket> = new Map();

  // Join a room
  joinRoom(roomId: number, playerId: number, ws: WebSocket): string {
    const socketId = `${roomId}-${playerId}-${Date.now()}`;

    const socket: GameRoomSocket = {
      id: socketId,
      roomId,
      playerId,
      ws,
      isReady: false,
    };

    // Add to room
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(socket);

    // Add to sockets map
    this.sockets.set(socketId, socket);

    // Set up WebSocket event handlers
    ws.on('close', () => this.handleDisconnect(socketId));
    ws.on('error', () => this.handleDisconnect(socketId));

    // Send join confirmation
    this.sendToSocket(socketId, {
      type: 'connected',
      data: { roomId, playerId, socketId },
      timestamp: new Date(),
    });

    // Notify other players in the room
    this.broadcastToRoom(
      roomId,
      {
        type: 'player_joined',
        data: { playerId, roomId },
        timestamp: new Date(),
      },
      socketId
    );

    return socketId;
  }

  // Leave a room
  leaveRoom(socketId: string): void {
    const socket = this.sockets.get(socketId);
    if (!socket) return;

    const { roomId, playerId } = socket;

    // Remove from room
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(socket);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }

    // Remove from sockets map
    this.sockets.delete(socketId);

    // Notify other players
    this.broadcastToRoom(roomId, {
      type: 'player_left',
      data: { playerId, roomId },
      timestamp: new Date(),
    });
  }

  // Update ready status
  updateReadyStatus(socketId: string, isReady: boolean): void {
    const socket = this.sockets.get(socketId);
    if (!socket) return;

    socket.isReady = isReady;

    // Notify all players in the room
    this.broadcastToRoom(socket.roomId, {
      type: 'ready_status_changed',
      data: { playerId: socket.playerId, isReady, roomId: socket.roomId },
      timestamp: new Date(),
    });
  }

  // Start game
  startGame(roomId: number): void {
    this.broadcastToRoom(roomId, {
      type: 'game_started',
      data: { roomId },
      timestamp: new Date(),
    });
  }

  // Send chat message
  sendChatMessage(socketId: string, message: string): void {
    const socket = this.sockets.get(socketId);
    if (!socket) return;

    this.broadcastToRoom(socket.roomId, {
      type: 'chat_message',
      data: {
        playerId: socket.playerId,
        message,
        roomId: socket.roomId,
      },
      timestamp: new Date(),
    });
  }

  // Get room info
  getRoomInfo(roomId: number): {
    playerCount: number;
    players: Array<{ playerId: number; isReady: boolean }>;
  } {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { playerCount: 0, players: [] };
    }

    const players = Array.from(room).map((socket) => ({
      playerId: socket.playerId,
      isReady: socket.isReady,
    }));

    return {
      playerCount: room.size,
      players,
    };
  }

  // Get all rooms info
  getAllRoomsInfo(): Map<
    number,
    {
      playerCount: number;
      players: Array<{ playerId: number; isReady: boolean }>;
    }
  > {
    const roomsInfo = new Map();

    for (const [roomId] of this.rooms) {
      roomsInfo.set(roomId, this.getRoomInfo(roomId));
    }

    return roomsInfo;
  }

  // Private methods
  private handleDisconnect(socketId: string): void {
    this.leaveRoom(socketId);
  }

  private sendToSocket(socketId: string, event: GameRoomEvent): void {
    const socket = this.sockets.get(socketId);
    if (!socket || socket.ws.readyState !== 1) return; // 1 = WebSocket.OPEN

    try {
      socket.ws.send(JSON.stringify(event));
    } catch (error) {
      console.error('Error sending message to socket:', error);
      this.leaveRoom(socketId);
    }
  }

  broadcastToRoom(
    roomId: number,
    event: GameRoomEvent,
    excludeSocketId?: string
  ): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    for (const socket of room) {
      if (excludeSocketId && socket.id === excludeSocketId) continue;
      this.sendToSocket(socket.id, event);
    }
  }
}

// Export singleton instance
export const gameRoomSocketManager = new GameRoomSocketManager();
