import { createRouter } from '@/lib/create-app';
import * as handlers from './decks.handlers';
import * as routes from './decks.routes';

const decksRouter = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default decksRouter;
