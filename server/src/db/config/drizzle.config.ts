import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { env } from '@/env';

import * as schema from '../schemas/index';

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: false,
});

export const db = drizzle(pool, { schema, logger: true });

export type DB = typeof db;
