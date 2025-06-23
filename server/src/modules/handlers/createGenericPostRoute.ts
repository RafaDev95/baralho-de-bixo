/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRoute } from '@hono/zod-openapi';
import type { BuildSchema } from 'drizzle-zod/schema.types.internal';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import type { ZodObject } from 'zod';

export function createGenericPostRoute<
  T extends ZodObject<any>,
  TColumns extends Record<string, unknown>,
  TRefinements extends Record<string, unknown> | undefined = undefined,
>({
  tag = 'Index',
  path,
  insertSchema,
  responseSchema,
  description = 'Create an entry',
}: {
  path: string;
  tag?: string;
  insertSchema: T;
  responseSchema: BuildSchema<'select', TColumns, TRefinements>;
  description?: string;
}) {
  return createRoute({
    tags: [tag],
    method: 'post',
    path,
    request: {
      body: {
        content: {
          'application/json': {
            schema: insertSchema,
          },
        },
        description,
      },
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(responseSchema, ''),
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        createErrorSchema(insertSchema),
        'The validation error(s)'
      ),
    },
  });
}
