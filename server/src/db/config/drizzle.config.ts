import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PGlite } from '@electric-sql/pglite';
import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import pg, { type Pool } from 'pg';

import { env } from '@/env';

import * as schema from '../schemas/index';

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: false,
});

export const prodDb = drizzle(pool, {
  schema,
  logger: true,
});

// Test database integration - using PGlite (in-memory PostgreSQL) by default
// Falls back to testcontainers if USE_TESTCONTAINERS env var is set
export let testContainer: StartedPostgreSqlContainer | null = null;
export let testPool: pg.Pool | null = null;
export let testPGlite: PGlite | null = null;
export let testDb: ReturnType<typeof drizzle> | null = null;

export async function initializeTestDatabase(): Promise<void> {
  // If already initialized, reuse existing database
  if (testDb && (testPool || testPGlite)) {
    console.log('[DATABASE]: Reusing existing test database');
    return;
  }

  // Use testcontainers if explicitly requested (for CI/CD or specific test scenarios)
  const useTestcontainers = process.env.USE_TESTCONTAINERS === 'true';

  if (useTestcontainers) {
    console.log('[DATABASE]: Using testcontainers (slower but more isolated)');
    return initializeTestcontainersDatabase();
  }

  // Default: Use PGlite (fast, in-memory PostgreSQL)
  console.log('[DATABASE]: Using PGlite (fast in-memory PostgreSQL)');
  return initializePGliteDatabase();
}

async function initializePGliteDatabase(): Promise<void> {
  console.log('[DATABASE]: Initializing PGlite...');
  const startTime = Date.now();

  try {
    // Create in-memory PGlite instance
    testPGlite = new PGlite();
    await testPGlite.waitReady;

    // PGlite exposes a Postgres-compatible interface
    // We can use it directly with drizzle
    testDb = drizzle(testPGlite as any, {
      schema,
      logger: false,
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[DATABASE]: PGlite initialized successfully in ${elapsed}s`);
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`[DATABASE]: PGlite initialization failed after ${elapsed}s:`, error);
    throw error;
  }
}

async function initializeTestcontainersDatabase(): Promise<void> {
  console.log('[DATABASE]: Started test mode with testcontainers');

  const { PostgreSqlContainer } = await import('@testcontainers/postgresql');
  console.log('[DATABASE]: Creating PostgreSQL container...');
  
  // Create container with extended timeout and explicit health check
  const container = new PostgreSqlContainer('postgres:14-alpine')
    .withDatabase('postgres')
    .withUsername('postgres')
    .withPassword('postgres')
    .withStartupTimeout(120000); // 120 second startup timeout
  
  console.log('[DATABASE]: Starting container (this may take a while on first run)...');
  const startTime = Date.now();
  
  try {
    testContainer = await container.start();
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[DATABASE]: Container started successfully in ${elapsed}s`);
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`[DATABASE]: Container startup failed after ${elapsed}s:`, error);
    throw error;
  }

  env.DATABASE_HOST = testContainer.getHost();
  env.DATABASE_PORT = testContainer.getMappedPort(5432);
  env.DATABASE_USERNAME = testContainer.getUsername();
  env.DATABASE_PASSWORD = testContainer.getPassword();
  env.DATABASE_NAME = testContainer.getDatabase();

  // Create test database connection
  const testConnectionString = `postgresql://${env.DATABASE_USERNAME}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`;
  testPool = new pg.Pool({
    connectionString: testConnectionString,
    ssl: false,
  });

  testDb = drizzle(testPool, {
    schema,
    logger: false,
  });

  console.log(
    `[DATABASE]: Test container started on ${env.DATABASE_HOST}:${env.DATABASE_PORT}`
  );
}

export async function cleanupTestDatabase(): Promise<void> {
  if (testPool) {
    await testPool.end();
    testPool = null;
  }

  if (testContainer) {
    await testContainer.stop();
    testContainer = null;
  }

  if (testPGlite) {
    await testPGlite.close();
    testPGlite = null;
  }

  testDb = null;
}

export function getDatabase(): NodePgDatabase<typeof schema> & {
  $client: Pool;
} {
  if (testDb) {
    return testDb as unknown as NodePgDatabase<typeof schema> & {
      $client: Pool;
    };
  }

  return prodDb;
}

export let db = getDatabase();

export function updateDatabase() {
  db = getDatabase();
}

export type DB = typeof prodDb;
