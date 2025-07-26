import {
  gameRoomPlayersSchema,
  gameRoomsSchema,
  insertGameRoomSchema,
} from '@/db/schemas';
import { notFoundSchema } from '@/utils/constants';
import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { IdParamsSchema, createErrorSchema } from 'stoker/openapi/schemas';
import { z } from 'zod';

const tags = ['Game Rooms'];

// Schema for joining a room
const joinRoomSchema = z.object({
  playerId: z.number(),
  deckId: z.number().optional(),
});

// Schema for updating player ready status
const updateReadyStatusSchema = z.object({
  isReady: z.enum(['ready', 'not_ready']),
});

export const list = createRoute({
  tags,
  path: '/game-rooms',
  method: 'get',
  request: {
    query: z.object({
      status: z
        .enum(['waiting', 'in_progress', 'finished', 'cancelled'])
        .optional(),
      includePlayers: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      gameRoomsSchema.array(),
      `${tags[0]} List`
    ),
  },
});

export const create = createRoute({
  tags,
  path: '/game-rooms',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: insertGameRoomSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(gameRoomsSchema, 'Created'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertGameRoomSchema),
      'Invalid room data'
    ),
  },
});

export const getById = createRoute({
  tags,
  path: '/game-rooms/{id}',
  request: {
    params: IdParamsSchema,
    query: z.object({
      includePlayers: z.string().optional(),
    }),
  },
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(gameRoomsSchema, 'Requested room'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
});

export const join = createRoute({
  tags,
  path: '/game-rooms/{id}/join',
  method: 'post',
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: joinRoomSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(gameRoomPlayersSchema, 'Joined room'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({
        message: z.string(),
      }),
      'Cannot join room'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Room not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(joinRoomSchema),
      'Invalid join data'
    ),
  },
});

export const leave = createRoute({
  tags,
  path: '/game-rooms/{id}/leave',
  method: 'post',
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            playerId: z.number(),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      'Left room'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Room not found'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({
        message: z.string(),
      }),
      'Cannot leave room'
    ),
  },
});

export const updateReadyStatus = createRoute({
  tags,
  path: '/game-rooms/{id}/ready',
  method: 'patch',
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: updateReadyStatusSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      gameRoomPlayersSchema,
      'Updated ready status'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Room not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateReadyStatusSchema),
      'Invalid ready status data'
    ),
  },
});

export const startGame = createRoute({
  tags,
  path: '/game-rooms/{id}/start',
  method: 'post',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(gameRoomsSchema, 'Game started'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({
        message: z.string(),
      }),
      'Cannot start game'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Room not found'),
  },
});

export type List = typeof list;
export type Create = typeof create;
export type GetById = typeof getById;
export type Join = typeof join;
export type Leave = typeof leave;
export type UpdateReadyStatus = typeof updateReadyStatus;
export type StartGame = typeof startGame;
