import { insertTradeSchema, tradesSchema } from '@/db/schemas';
import { notFoundSchema } from '@/lib/constants';
import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { IdParamsSchema, createErrorSchema } from 'stoker/openapi/schemas';

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

export const create = createRoute({
  path: '/trades',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: insertTradeSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(tradesSchema, 'Created'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTradeSchema),
      'Invalid trade data'
    ),
  },
});

export const update = createRoute({
  path: '/trades/{id}',
  method: 'patch',
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: insertTradeSchema.partial(),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(tradesSchema, 'Updated'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
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
