import { decksSchema, insertDeckSchema } from '@/db/schemas';
import { notFoundSchema } from '@/lib/constants';
import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { IdParamsSchema, createErrorSchema } from 'stoker/openapi/schemas';

const tags = ['Decks'];

export const list = createRoute({
  tags,
  path: '/decks',
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(decksSchema.array(), `${tags[0]} List`),
  },
});

export const create = createRoute({
  path: '/decks',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: insertDeckSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(decksSchema, 'Created'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertDeckSchema),
      'Invalid deck data'
    ),
  },
});

export const getById = createRoute({
  tags,
  path: '/decks/{id}',
  request: { params: IdParamsSchema },
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(decksSchema, 'Requested deck'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
});

export const update = createRoute({
  path: '/decks/{id}',
  method: 'patch',
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: insertDeckSchema.partial(),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(decksSchema, 'Updated'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
});

export const remove = createRoute({
  path: '/decks/{id}',
  method: 'delete',
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Deck deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error'
    ),
  },
});

export type List = typeof list;
export type GetById = typeof getById;
export type Create = typeof create;
export type Update = typeof update;
export type Remove = typeof remove;
