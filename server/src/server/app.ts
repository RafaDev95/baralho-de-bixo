import configureOpenApi from '@/lib/configure-openapi';
import createApp from '@/lib/create-app';
import cards from '@/modules/cards';
import gameRoomsWebSocket from '@/modules/game-rooms/game-rooms-websocket';
import index from '@/modules/index.route';
const app = createApp();

const routes = [index, cards, gameRoomsWebSocket] as const;

configureOpenApi(app);
// biome-ignore lint/complexity/noForEach: <explanation>
routes.forEach((route) => {
  app.route('/', route);
});

export type AppType = (typeof routes)[number];

export default app;
