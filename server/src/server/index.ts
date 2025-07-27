import { serve } from '@hono/node-server';

import { env } from '@/env';
import { gameRoomWebSocketServer } from '@/lib/websocket/websocket-server';

import app from './app';

const port = env.PORT;

console.info('server started', `http://localhost:${port}`);

gameRoomWebSocketServer.start();

serve({
  fetch: app.fetch,
  port,
});
