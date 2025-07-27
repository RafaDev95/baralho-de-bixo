import { gameRoomSocketManager } from '@/lib/websocket/game-room-socket';
import { Hono } from 'hono';
import { z } from 'zod';

const gameRoomsWebSocket = new Hono();

const joinRoomSchema = z.object({
  type: z.literal('join_room'),
  roomId: z.number(),
  playerId: z.number(),
});

const readyStatusSchema = z.object({
  type: z.literal('ready_status'),
  isReady: z.boolean(),
});

const chatMessageSchema = z.object({
  type: z.literal('chat_message'),
  message: z.string().min(1).max(500),
});

const leaveRoomSchema = z.object({
  type: z.literal('leave_room'),
});

export const messageSchema = z.discriminatedUnion('type', [
  joinRoomSchema,
  readyStatusSchema,
  chatMessageSchema,
  leaveRoomSchema,
]);

gameRoomsWebSocket.get('/:roomId/info', (c) => {
  const roomId = Number.parseInt(c.req.param('roomId'), 10);
  const roomInfo = gameRoomSocketManager.getRoomInfo(roomId);

  return c.json({
    roomId,
    ...roomInfo,
  });
});

gameRoomsWebSocket.get('/info', (c) => {
  const roomsInfo = gameRoomSocketManager.getAllRoomsInfo();
  const roomsArray = Array.from(roomsInfo.entries()).map(([roomId, info]) => ({
    roomId,
    ...info,
  }));

  return c.json(roomsArray);
});

// WebSocket endpoint (will be handled by the main server)
gameRoomsWebSocket.get('/ws/:roomId', (c) => {
  return c.json({
    message: 'WebSocket endpoint - connect via ws:// protocol',
    roomId: c.req.param('roomId'),
  });
});

export default gameRoomsWebSocket;
