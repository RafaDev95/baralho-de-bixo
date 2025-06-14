import { createRoute } from '@hono/zod-openapi';
import { decksSchema, insertDeckSchema } from '@/db/schemas';
import { jsonContent } from 'stoker/openapi/helpers';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { notFoundSchema } from '@/lib/constants';
import { createGenericPatchRoute, createGenericPostRoute } from '../handlers';

const tags = ['Decks'];

export const list = createRoute({
  tags,
  path: '/decks',
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(decksSchema.array(), `${tags[0]} List`),
  },
});

export const create = createGenericPostRoute({
  path: '/decks',
  insertSchema: insertDeckSchema,
  responseSchema: decksSchema,
  description: 'Create a deck',
  tag: tags[0],
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

export const update = createGenericPatchRoute({
  tag: tags[0],
  path: '/decks/{id}',
  responseSchema: decksSchema,
  updateSchema: insertDeckSchema.partial(),
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
