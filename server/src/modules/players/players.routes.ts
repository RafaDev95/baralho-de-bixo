import { insertPlayerSchema, playersSchema } from '@/db/schemas';
import { notFoundSchema } from '@/lib/constants';
import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { IdParamsSchema, createErrorSchema } from 'stoker/openapi/schemas';

const tags = ['Players'];

export const list = createRoute({
  tags,
  path: '/players',
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(playersSchema.array(), `${tags[0]} List`),
  },
});

export const create = createRoute({
  tags,
  path: '/players',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: insertPlayerSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(playersSchema, 'Created'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertPlayerSchema),
      'Invalid player data'
    ),
  },
});

export const getById = createRoute({
  tags,
  path: '/players/{id}',
  request: { params: IdParamsSchema },
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(playersSchema, 'Requested player'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
});

export const update = createRoute({
  path: '/players/{id}',
  method: 'patch',
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: insertPlayerSchema.partial(),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(playersSchema, 'Updated'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
});

export const remove = createRoute({
  path: '/players/{id}',
  method: 'delete',
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Player deleted',
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
