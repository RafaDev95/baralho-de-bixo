import { OpenAPIHono } from '@hono/zod-openapi';
import { notFound, onError } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';

import { customLogger } from '@/middleware/pino-logger';

import type { AppBindings } from './types';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    // Esse defaultHook age é um middleware que normalmente é usado para validar o body da request (validor)
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  // Logar todas as requisições com dados detalhados no console.
  app.use(customLogger());
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
