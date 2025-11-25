import configureOpenApi from '@/lib/configure-openapi';
import createApp from '@/lib/create-app';
import cards from '@/modules/cards';
import decks from '@/modules/decks';
import gameRooms from '@/modules/game-rooms';
import roomInfoRoutes from '@/lib/websocket/room-info-routes';
import index from '@/modules/index.route';
import players from '@/modules/players';

const app = createApp();

const routes = [
  index,
  cards,
  decks,
  gameRooms,
  roomInfoRoutes,
  players,
] as const;

configureOpenApi(app);

for (const route of routes) {
  app.route('/', route);
}

export type AppType = (typeof routes)[number];

export default app;
