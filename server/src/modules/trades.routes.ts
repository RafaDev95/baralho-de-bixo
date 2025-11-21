import { insertTradeSchema, tradesSchema } from '@/db/schemas/trades';
import { notFoundSchema } from '@/utils/constants';
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
    [HttpStatusCodes.OK]: jsonContent(tradesSchema.array(), `${tags[0]} List`),
  },
});

export const create = createRoute({
  tags,
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
    [HttpStatusCodes.CREATED]: jsonContent(tradesSchema, 'Trade created'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTradeSchema),
      'Invalid trade data'
    ),
  },
});

export const getById = createRoute({
  tags,
  path: '/trades/{id}',
  request: { params: IdParamsSchema },
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(tradesSchema, 'Requested trade'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
});

export const update = createRoute({
  tag: tags[0],
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
    [HttpStatusCodes.OK]: jsonContent(tradesSchema, 'Trade updated'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
});

export const remove = createRoute({
  path: '/trades/{id}',
  method: 'delete',
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Trade deleted',
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
