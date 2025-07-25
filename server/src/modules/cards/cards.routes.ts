import { cardsSchema, insertCardSchema, updateCardSchema } from '@/db/schemas';
import { notFoundSchema } from '@/utils/constants';
import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { IdParamsSchema, createErrorSchema } from 'stoker/openapi/schemas';

const tags = ['Cards'];

export const list = createRoute({
  tags,
  path: '/cards',
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(cardsSchema.array(), `${tags[0]} List`),
  },
});

export const create = createRoute({
  path: '/cards',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: insertCardSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(cardsSchema, 'Created'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertCardSchema),
      'Invalid card data'
    ),
  },
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

export const update = createRoute({
  path: '/cards/{id}',
  method: 'patch',
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: updateCardSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(cardsSchema, 'Updated'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error'
    ),
  },
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
