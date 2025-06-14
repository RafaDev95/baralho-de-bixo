import { pinoLogger } from 'hono-pino';
import pino from 'pino';
import pretty from 'pino-pretty';

import { env } from '@/env';

export const customLogger = () => {
  return pinoLogger({
    pino: pino(
      { level: process.env.LOG_LEVEL || 'info' },
      env.NODE_ENV === 'production' ? undefined : pretty()
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
};
