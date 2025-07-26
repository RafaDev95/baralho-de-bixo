import { createRouter } from '@/lib/create-app';
import * as handlers from './game-rooms.handlers';
import * as routes from './game-rooms.routes';

const gameRoomsRouter = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.join, handlers.join)
  .openapi(routes.leave, handlers.leave)
  .openapi(routes.updateReadyStatus, handlers.updateReadyStatus)
  .openapi(routes.startGame, handlers.startGame);

export default gameRoomsRouter;
