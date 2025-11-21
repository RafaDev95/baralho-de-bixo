import { db } from '@/db/config';
import { gameSessionsTable } from '@/db/schemas';
import { eq } from 'drizzle-orm';
import { gameEventEmitter } from '../game/game-event-emitter';
import type { GameEvent } from '../game/game-event-types';
import { gameRoomSocketManager } from './game-room-socket';

/**
 * Game Socket Manager
 * 
 * Connects game events (Observer pattern) to WebSocket broadcasts.
 * Maps game sessions to room IDs and broadcasts game events to players.
 */
export class GameSocketManager {
  private gameToRoomMap: Map<number, number> = new Map();

  constructor() {
    this.setupGameEventListeners();
  }

  /**
   * Register a game session with its room ID
   */
  async registerGame(gameId: number, roomId: number): Promise<void> {
    this.gameToRoomMap.set(gameId, roomId);
  }

  /**
   * Unregister a game session
   */
  unregisterGame(gameId: number): void {
    this.gameToRoomMap.delete(gameId);
  }

  /**
   * Get room ID for a game
   */
  async getRoomIdForGame(gameId: number): Promise<number | null> {
    // Check cache first
    if (this.gameToRoomMap.has(gameId)) {
      return this.gameToRoomMap.get(gameId)!;
    }

    // Query database if not in cache
    const gameSession = await db.query.gameSessionsTable.findFirst({
      where: eq(gameSessionsTable.id, gameId),
    });

    if (gameSession?.roomId) {
      this.gameToRoomMap.set(gameId, gameSession.roomId);
      return gameSession.roomId;
    }

    return null;
  }

  /**
   * Setup listeners for game events and broadcast via WebSocket
   */
  private setupGameEventListeners(): void {
    // Listen to all game events
    gameEventEmitter.onAll(async (event: GameEvent) => {
      const roomId = await this.getRoomIdForGame(event.gameId);
      if (!roomId) {
        return; // Game not found or not registered
      }

      // Broadcast game event to all players in the room
      gameRoomSocketManager.broadcastToRoom(roomId, {
        type: 'game_event',
        data: event as Record<string, unknown>,
        timestamp: new Date(),
      });
    });
  }

  /**
   * Broadcast message to a specific player in a room
   */
  private broadcastToPlayer(
    roomId: number,
    playerId: number,
    message: { type: string; data: unknown; timestamp: Date }
  ): void {
    // Broadcast to all players in the room
    // Clients can filter based on the event data
    gameRoomSocketManager.broadcastToRoom(roomId, {
      type: 'game_event',
      data: {
        ...message.data,
        targetPlayerId: playerId, // Include target player for filtering
      } as Record<string, unknown>,
      timestamp: message.timestamp,
    });
  }
}

// Export singleton instance
export const gameSocketManager = new GameSocketManager();

