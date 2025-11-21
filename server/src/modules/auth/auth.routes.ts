import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { z } from 'zod';

// Schema definitions
const PlayerSignUpRequestSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username too long'),
  email: z.string().email('Invalid email format'),
});

const PlayerSignInRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const PlayerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  player: z
    .object({
      id: z.number(),
      username: z.string(),
      email: z.string(),
      balance: z.number(),
      rank: z.number(),
      created_at: z.string(),
    })
    .optional(),
  error: z.string().optional(),
});

// Routes
export const playerSignUp = createRoute({
  method: 'post',
  path: '/signup',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PlayerSignUpRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      PlayerResponseSchema,
      'Player registered successfully'
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      PlayerResponseSchema,
      'Invalid request'
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      PlayerResponseSchema,
      'Player already exists'
    ),
  },
  tags: ['Authentication'],
  summary: 'Player sign up',
  description: 'Register a new player with username and email',
});

export const playerSignIn = createRoute({
  method: 'post',
  path: '/signin',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PlayerSignInRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      PlayerResponseSchema,
      'Player signed in successfully'
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      PlayerResponseSchema,
      'Invalid request'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      PlayerResponseSchema,
      'Player not found'
    ),
  },
  tags: ['Authentication'],
  summary: 'Player sign in',
  description: 'Sign in existing player by email',
});

export const getPlayerProfile = createRoute({
  method: 'get',
  path: '/profile/{email}',
  request: {
    params: z.object({
      email: z.string().email('Invalid email format'),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      PlayerResponseSchema,
      'Player profile retrieved'
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      PlayerResponseSchema,
      'Invalid email'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      PlayerResponseSchema,
      'Player not found'
    ),
  },
  tags: ['Authentication'],
  summary: 'Get player profile',
  description: 'Retrieve player profile by email',
});
