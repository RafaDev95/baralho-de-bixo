import {
  gameCardsSchema,
  gamePlayersSchema,
  gameSessionsSchema,
} from '@/db/schemas';
import { OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';
import { gameSessionsHandlers } from './game-sessions.handlers';

// Request/Response schemas
const startGameSchema = z.object({
  roomId: z.number().int().positive(),
});

const gameActionSchema = z.object({
  type: z.enum([
    'play_card',
    'attack',
    'block',
    'activate_ability',
    'cast_spell',
    'draw_card',
    'discard_card',
    'end_turn',
    'concede',
    'mulligan',
  ]),
  data: z.record(z.unknown()).optional(),
});

const gameStateResponseSchema = z.object({
  gameId: z.number(),
  currentTurn: z.number(),
  currentPlayerIndex: z.number(),
  phase: z.string(),
  step: z.string(),
  players: z.array(gamePlayersSchema),
  cards: z.array(gameCardsSchema),
});

// Create router
const gameSessionsRouter = new OpenAPIHono();

// Start a new game from a ready room
gameSessionsRouter.openapi(
  {
    method: 'post',
    path: '/start',
    request: {
      body: {
        content: {
          'application/json': {
            schema: startGameSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: gameSessionsSchema,
          },
        },
        description: 'Game started successfully',
      },
      400: {
        description: 'Invalid request or room not ready',
      },
      404: {
        description: 'Room not found',
      },
    },
    tags: ['Game Sessions'],
    summary: 'Start a new game from a ready room',
  },
  gameSessionsHandlers.startGame
);

// Get game state
gameSessionsRouter.openapi(
  {
    method: 'get',
    path: '/{gameId}/state',
    request: {
      params: z.object({
        gameId: z.string().transform(Number),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: gameStateResponseSchema,
          },
        },
        description: 'Game state retrieved successfully',
      },
      404: {
        description: 'Game not found',
      },
    },
    tags: ['Game Sessions'],
    summary: 'Get current game state',
  },
  gameSessionsHandlers.getGameState
);

// Process a game action
gameSessionsRouter.openapi(
  {
    method: 'post',
    path: '/{gameId}/action',
    request: {
      params: z.object({
        gameId: z.string().transform(Number),
      }),
      body: {
        content: {
          'application/json': {
            schema: gameActionSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Action processed successfully',
      },
      400: {
        description: 'Invalid action or game state',
      },
      404: {
        description: 'Game not found',
      },
    },
    tags: ['Game Sessions'],
    summary: 'Process a game action',
  },
  gameSessionsHandlers.processGameAction
);

// End a game session
gameSessionsRouter.openapi(
  {
    method: 'post',
    path: '/{gameId}/end',
    request: {
      params: z.object({
        gameId: z.string().transform(Number),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              winnerId: z.number().int().positive().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Game ended successfully',
      },
      404: {
        description: 'Game not found',
      },
    },
    tags: ['Game Sessions'],
    summary: 'End a game session',
  },
  gameSessionsHandlers.endGame
);

// Get all active games
gameSessionsRouter.openapi(
  {
    method: 'get',
    path: '/active',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(gameSessionsSchema),
          },
        },
        description: 'Active games retrieved successfully',
      },
      500: {
        description: 'Internal server error',
      },
    },
    tags: ['Game Sessions'],
    summary: 'Get all active game sessions',
  },
  gameSessionsHandlers.getActiveGames
);

export default gameSessionsRouter;
