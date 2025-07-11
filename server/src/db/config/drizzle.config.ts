import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import pg, { type Pool } from "pg";

import { env } from "@/env";

import * as schema from "../schemas/index";

export const pool = new pg.Pool({
	connectionString: env.DATABASE_URL,
	ssl: false,
});

export const prodDb = drizzle(pool, {
	schema,
	logger: true,
});

// Testcontainers integration
export let testContainer: StartedPostgreSqlContainer | null = null;
export let testPool: pg.Pool | null = null;
export let testDb: ReturnType<typeof drizzle> | null = null;

export async function initializeTestDatabase(): Promise<void> {
	console.log("[DATABASE]: Started test mode");

	const { PostgreSqlContainer } = await import("@testcontainers/postgresql");
	testContainer = await new PostgreSqlContainer("postgres:14-alpine")
		.withDatabase("postgres")
		.withUsername("postgres")
		.withPassword("postgres")
		.start();

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
		`[DATABASE]: Test container started on ${env.DATABASE_HOST}:${env.DATABASE_PORT}`,
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
