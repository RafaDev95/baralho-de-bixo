import { messageSchema } from '@/modules/game-rooms/game-rooms-websocket';
import type { WebSocket } from 'ws';
import { WebSocketServer } from 'ws';
import { gameRoomSocketManager } from './game-room-socket';

export class GameRoomWebSocketServer {
  private wss: WebSocketServer;
  private port: number;

  constructor(port = 8081) {
    this.port = port;
    this.wss = new WebSocketServer({ port });
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection');

      let socketId: string | null = null;

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          const parsedMessage = messageSchema.parse(message);

          switch (parsedMessage.type) {
            case 'join_room':
              if (socketId) {
                ws.send(
                  JSON.stringify({
                    type: 'error',
                    data: { message: 'Already joined a room' },
                    timestamp: new Date(),
                  })
                );
                return;
              }

              socketId = gameRoomSocketManager.joinRoom(
                parsedMessage.roomId,
                parsedMessage.playerId,
                ws
              );
              break;

            case 'ready_status':
              if (!socketId) {
                ws.send(
                  JSON.stringify({
                    type: 'error',
                    data: { message: 'Not connected to a room' },
                    timestamp: new Date(),
                  })
                );
                return;
              }

              gameRoomSocketManager.updateReadyStatus(
                socketId,
                parsedMessage.isReady
              );
              break;

            case 'chat_message':
              if (!socketId) {
                ws.send(
                  JSON.stringify({
                    type: 'error',
                    data: { message: 'Not connected to a room' },
                    timestamp: new Date(),
                  })
                );
                return;
              }

              gameRoomSocketManager.sendChatMessage(
                socketId,
                parsedMessage.message
              );
              break;

            case 'leave_room':
              if (socketId) {
                gameRoomSocketManager.leaveRoom(socketId);
                socketId = null;
              }
              break;
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(
            JSON.stringify({
              type: 'error',
              data: { message: 'Invalid message format' },
              timestamp: new Date(),
            })
          );
        }
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        if (socketId) {
          gameRoomSocketManager.leaveRoom(socketId);
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        if (socketId) {
          gameRoomSocketManager.leaveRoom(socketId);
        }
      });
    });

    this.wss.on('listening', () => {
      console.log(`WebSocket server listening on port ${this.port}`);
    });

    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
  }

  public start(): void {
    console.log(`Starting WebSocket server on port ${this.port}`);
  }

  public stop(): void {
    this.wss.close();
    console.log('WebSocket server stopped');
  }

  public getPort(): number {
    return this.port;
  }
}

// Export singleton instance
export const gameRoomWebSocketServer = new GameRoomWebSocketServer();
