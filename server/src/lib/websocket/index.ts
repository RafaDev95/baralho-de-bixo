/**
 * WebSocket Module
 *
 * Handles all WebSocket-related functionality for game rooms:
 * - Room socket connections and management
 * - Game event broadcasting
 * - WebSocket server setup
 * - Room info HTTP routes
 */

export { gameRoomSocketManager } from './game-room-socket';
export type { GameRoomSocket, GameRoomEvent } from './game-room-socket';

export { gameSocketManager } from './game-socket-manager';

export { gameRoomWebSocketServer } from './websocket-server';

export { messageSchema } from './room-info-routes';
export { default as roomInfoRoutes } from './room-info-routes';
