import { createRoute } from '@hono/zod-openapi';
import { tradesSchema, insertTradeSchema } from '../../db/schemas/trades';
import { jsonContent } from 'stoker/openapi/helpers';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { notFoundSchema } from '../../lib/constants';
import { createGenericPatchRoute, createGenericPostRoute } from '../handlers';

const tags = ['Trades'];

export const list = createRoute({
  tags,
  path: '/trades',
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(tradesSchema.array(), 'List of trades'),
  },
});

export const getById = createRoute({
  tags,
  path: '/trades/{id}',
  method: 'get',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(tradesSchema, 'Trade details'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
});

export const create = createGenericPostRoute({
  path: '/trades',
  insertSchema: insertTradeSchema,
  responseSchema: tradesSchema,
  description: 'Create a trade',
  tag: tags[0],
});

export const update = createGenericPatchRoute({
  tag: tags[0],
  path: '/trades/{id}',
  responseSchema: tradesSchema,
  updateSchema: insertTradeSchema.partial(),
});

export const remove = createRoute({
  tags,
  path: '/trades/{id}',
  method: 'delete',
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: 'Trade deleted' },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
});

export type List = typeof list;
export type GetById = typeof getById;
export type Create = typeof create;
export type Update = typeof update;
export type Remove = typeof remove;
