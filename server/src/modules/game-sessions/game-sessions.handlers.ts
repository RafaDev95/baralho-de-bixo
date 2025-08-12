import { db } from '@/db/config';
import { gameSessionsTable } from '@/db/schemas';
import { gameEngine } from '@/lib/game/game-engine-simple';
import { eq } from 'drizzle-orm';
import type { Context } from 'hono';

export const gameSessionsHandlers = {
  /**
   * Start a new game from a ready room
   */
  async startGame(c: Context) {
    try {
      const { roomId } = await c.req.json();

      // Validate roomId
      if (!roomId || typeof roomId !== 'number' || roomId <= 0) {
        return c.json({ error: 'Invalid room ID' }, 400);
      }

      // Start the game using the game engine
      const gameSession = await gameEngine.createGameSession(roomId);

      return c.json(gameSession, 200);
    } catch (error) {
      console.error('Error starting game:', error);

      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return c.json({ error: 'Room not found' }, 404);
        }
        if (error.message.includes('not ready')) {
          return c.json({ error: 'Room is not ready to start' }, 400);
        }
        if (error.message.includes('Need at least 2 players')) {
          return c.json(
            { error: 'Need at least 2 players to start a game' },
            400
          );
        }
      }

      return c.json({ error: 'Failed to start game' }, 500);
    }
  },

  /**
   * Get current game state
   */
  async getGameState(c: Context) {
    try {
      const gameId = Number(c.req.param('gameId'));

      if (!gameId || Number.isNaN(gameId)) {
        return c.json({ error: 'Invalid game ID' }, 400);
      }

      // Get game state from the engine
      const gameState = gameEngine.getGameState(gameId);

      if (!gameState) {
        return c.json({ error: 'Game not found' }, 404);
      }

      return c.json(gameState, 200);
    } catch (error) {
      console.error('Error getting game state:', error);
      return c.json({ error: 'Failed to get game state' }, 500);
    }
  },

  /**
   * Process a game action
   */
  async processGameAction(c: Context) {
    try {
      const gameId = Number(c.req.param('gameId'));

      if (!gameId || Number.isNaN(gameId)) {
        return c.json({ error: 'Invalid game ID' }, 400);
      }

      const { type, data } = await c.req.json();

      // Validate action type
      if (!type || typeof type !== 'string') {
        return c.json({ error: 'Action type is required' }, 400);
      }

      // For now, we'll use a mock player ID - in a real app this would come from authentication
      const playerId = 1; // TODO: Get from authenticated user context

      // Process the action using the game engine
      await gameEngine.processGameAction(gameId, {
        type: type as
          | 'play_card'
          | 'attack'
          | 'block'
          | 'activate_ability'
          | 'cast_spell'
          | 'draw_card'
          | 'discard_card'
          | 'end_turn'
          | 'concede'
          | 'mulligan',
        playerId,
        data,
      });

      return c.json({ message: 'Action processed successfully' }, 200);
    } catch (error) {
      console.error('Error processing game action:', error);

      if (error instanceof Error) {
        if (error.message.includes('Game not found')) {
          return c.json({ error: 'Game not found' }, 404);
        }
        if (error.message.includes('Invalid action')) {
          return c.json(
            { error: 'Invalid action for current game state' },
            400
          );
        }
        if (error.message.includes('Unsupported action type')) {
          return c.json({ error: 'Unsupported action type' }, 400);
        }
      }

      return c.json({ error: 'Failed to process action' }, 500);
    }
  },

  /**
   * End a game session
   */
  async endGame(c: Context) {
    try {
      const gameId = Number(c.req.param('gameId'));

      if (!gameId || Number.isNaN(gameId)) {
        return c.json({ error: 'Invalid game ID' }, 400);
      }

      const { winnerId } = await c.req.json();

      // End the game using the game engine
      await gameEngine.endGameSession(gameId, winnerId);

      return c.json({ message: 'Game ended successfully' }, 200);
    } catch (error) {
      console.error('Error ending game:', error);

      if (error instanceof Error) {
        if (error.message.includes('Game not found')) {
          return c.json({ error: 'Game not found' }, 404);
        }
      }

      return c.json({ error: 'Failed to end game' }, 500);
    }
  },

  /**
   * Get all active games
   */
  async getActiveGames(c: Context) {
    try {
      // Get game session details from database
      const gameSessions = await db.query.gameSessionsTable.findMany({
        where: eq(gameSessionsTable.status, 'active'),
        with: {
          players: {
            with: {
              player: true,
            },
          },
        },
      });

      return c.json(gameSessions, 200);
    } catch (error) {
      console.error('Error getting active games:', error);
      return c.json({ error: 'Failed to get active games' }, 500);
    }
  },
};
