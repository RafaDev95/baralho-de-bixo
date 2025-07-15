import { createRouter } from '@/lib/create-app';
import * as handlers from './players.handlers';
import * as routes from './players.routes';

const playersRouter = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default playersRouter;
