/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRoute } from '@hono/zod-openapi';
import type { BuildSchema } from 'drizzle-zod/schema.types.internal';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentOneOf } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import type { ZodObject } from 'zod';

import { notFoundSchema } from '@/lib/constants';

export function createGenericPatchRoute<
  T extends ZodObject<any>,
  TColumns extends Record<string, unknown>,
  TRefinements extends Record<string, unknown> | undefined = undefined,
>({
  tag = 'Index',
  path,
  updateSchema,
  responseSchema,
  description = 'Updated',
}: {
  path: string;
  tag?: string;
  updateSchema: T;
  responseSchema: BuildSchema<'select', TColumns, TRefinements>;
  description?: string;
}) {
  return createRoute({
    tags: [tag],
    path,
    method: 'patch',
    request: {
      params: IdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: updateSchema,
          },
        },
        description,
      },
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(responseSchema, 'Updated'),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
        [createErrorSchema(updateSchema), createErrorSchema(IdParamsSchema)],
        'The validation error(s)'
      ),
    },
  });
}
