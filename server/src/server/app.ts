import configureOpenApi from '@/lib/configure-openapi';
import createApp from '@/lib/create-app';
import cards from '@/modules/cards';
import decks from '@/modules/decks';
import gameRooms from '@/modules/game-rooms';
import gameRoomsWebSocket from '@/modules/game-rooms/game-rooms-websocket';
import index from '@/modules/index.route';
import players from '@/modules/players';
import trades from '@/modules/trades';

const app = createApp();

const routes = [
  index,
  cards,
  decks,
  gameRooms,
  gameRoomsWebSocket,
  players,
  trades,
] as const;

configureOpenApi(app);

for (const route of routes) {
  app.route('/', route);
}

export type AppType = (typeof routes)[number];

export default app;
