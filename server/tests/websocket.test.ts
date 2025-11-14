import { gameRoomSocketManager } from '@/lib/websocket/game-room-socket';
import { gameRoomWebSocketServer } from '@/lib/websocket/websocket-server';
import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { WebSocket } from 'ws';

describe('WebSocket Game Rooms', () => {
  const wsPort = 8081;
  const wsUrl = `ws://localhost:${wsPort}`;

  beforeAll(async () => {
    // Start WebSocket server
    gameRoomWebSocketServer.start();

    // Wait a bit for server to start
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterAll(async () => {
    // Stop WebSocket server
    gameRoomWebSocketServer.stop();
  });

  describe('WebSocket Connection', () => {
    it('should connect to WebSocket server', async () => {
      return new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(wsUrl);

        ws.on('open', () => {
          expect(ws.readyState).toBe(WebSocket.OPEN);
          ws.close();
          resolve();
        });

        ws.on('error', (error) => {
          reject(error);
        });
      });
    });
  });

  describe('Room Management', () => {
    it('should join a room via WebSocket', async () => {
      return new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        const roomId = 1;
        const playerId = 1;

        ws.on('open', () => {
          // Send join room message
          ws.send(
            JSON.stringify({
              type: 'join_room',
              roomId,
              playerId,
            })
          );
        });

        ws.on('message', (data) => {
          const message = JSON.parse(data.toString());

          if (message.type === 'connected') {
            expect(message.data.roomId).toBe(roomId);
            expect(message.data.playerId).toBe(playerId);
            expect(message.data.socketId).toBeDefined();

            // Check if player is in the room
            const roomInfo = gameRoomSocketManager.getRoomInfo(roomId);
            expect(roomInfo.playerCount).toBe(1);
            expect(roomInfo.players[0].playerId).toBe(playerId);

            ws.close();
            resolve();
          }
        });

        ws.on('error', (error) => {
          reject(error);
        });
      });
    });

    it('should handle ready status updates', async () => {
      return new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        const roomId = 2;
        const playerId = 2;
        let connected = false;

        ws.on('open', () => {
          // Join room first
          ws.send(
            JSON.stringify({
              type: 'join_room',
              roomId,
              playerId,
            })
          );
        });

        ws.on('message', (data) => {
          const message = JSON.parse(data.toString());

          if (message.type === 'connected' && !connected) {
            connected = true;

            // Send ready status
            ws.send(
              JSON.stringify({
                type: 'ready_status',
                isReady: true,
              })
            );
          } else if (message.type === 'ready_status_changed') {
            expect(message.data.playerId).toBe(playerId);
            expect(message.data.isReady).toBe(true);
            expect(message.data.roomId).toBe(roomId);

            ws.close();
            resolve();
          }
        });

        ws.on('error', (error) => {
          reject(error);
        });
      });
    });

    it('should handle chat messages', async () => {
      return new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        const roomId = 3;
        const playerId = 3;
        const chatMessage = 'Hello, everyone!';
        let connected = false;

        ws.on('open', () => {
          // Join room first
          ws.send(
            JSON.stringify({
              type: 'join_room',
              roomId,
              playerId,
            })
          );
        });

        ws.on('message', (data) => {
          const message = JSON.parse(data.toString());

          if (message.type === 'connected' && !connected) {
            connected = true;

            // Send chat message
            ws.send(
              JSON.stringify({
                type: 'chat_message',
                message: chatMessage,
              })
            );
          } else if (message.type === 'chat_message') {
            expect(message.data.playerId).toBe(playerId);
            expect(message.data.message).toBe(chatMessage);
            expect(message.data.roomId).toBe(roomId);

            ws.close();
            resolve();
          }
        });

        ws.on('error', (error) => {
          reject(error);
        });
      });
    });

    it('should handle leaving a room', async () => {
      return new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        const roomId = 4;
        const playerId = 4;

        ws.on('open', () => {
          // Join room first
          ws.send(
            JSON.stringify({
              type: 'join_room',
              roomId,
              playerId,
            })
          );
        });

        ws.on('message', (data) => {
          const message = JSON.parse(data.toString());

          if (message.type === 'connected') {
            // Check player is in room
            let roomInfo = gameRoomSocketManager.getRoomInfo(roomId);
            expect(roomInfo.playerCount).toBe(1);

            // Leave room
            ws.send(
              JSON.stringify({
                type: 'leave_room',
              })
            );

            // Wait a bit for cleanup
            setTimeout(() => {
              roomInfo = gameRoomSocketManager.getRoomInfo(roomId);
              expect(roomInfo.playerCount).toBe(0);

              ws.close();
              resolve();
            }, 100);
          }
        });

        ws.on('error', (error) => {
          reject(error);
        });
      });
    });
  });
});
