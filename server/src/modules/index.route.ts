import { createRouter } from '@/lib/create-app';
import auth from '@/modules/auth';
import cards from '@/modules/cards';
import decks from '@/modules/decks';
import players from '@/modules/players';
import trades from '@/modules/trades';
import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

const router = createRouter()
  .openapi(
    createRoute({
      tags: ['Index'],
      method: 'get',
      path: '/',
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          createMessageObjectSchema('MJW API'),
          'MJW API Index'
        ),
      },
    }),
    (c) => {
      return c.json(
        {
          message: 'MJW API',
        },
        HttpStatusCodes.OK
      );
    }
  )
  .route('/', cards)
  .route('/', decks)
  .route('/', players)
  .route('/', trades)
  .route('/auth', auth);

export default router;
