import { createRouter } from '@/lib/create-app';
import * as handlers from './cards.handlers';
import * as routes from './cards.routes';

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.create, handlers.create)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default router;
