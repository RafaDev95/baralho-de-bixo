import { createRoute } from '@hono/zod-openapi';
import { cardsSchema, insertCardSchema, updateCardSchema } from '@/db/schemas';
import { jsonContent } from 'stoker/openapi/helpers';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { notFoundSchema } from '@/lib/constants';
import { createGenericPatchRoute, createGenericPostRoute } from '../handlers';

const tags = ['Cards'];

export const list = createRoute({
  tags,
  path: '/cards',
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(cardsSchema.array(), `${tags[0]} List`),
  },
});

export const create = createGenericPostRoute({
  path: '/cards',
  insertSchema: insertCardSchema,
  responseSchema: cardsSchema,
  description: 'Create a card',
  tag: tags[0],
});

export const getById = createRoute({
  tags,
  path: '/cards/{id}',
  request: { params: IdParamsSchema },
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(cardsSchema, 'Requested card'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
});

export const update = createGenericPatchRoute({
  tag: tags[0],
  path: '/cards/{id}',
  responseSchema: cardsSchema,
  updateSchema: updateCardSchema,
});

export const remove = createRoute({
  path: '/cards/{id}',
  method: 'delete',
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Card deleted',
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
