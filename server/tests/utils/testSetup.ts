import drizzleConfig from '$/drizzle.config';
import {
  initializeTestDatabase,
  testDb,
  updateDatabase,
} from '@/db/config/drizzle.config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export const setupTestDatabase = async () => {
  await initializeTestDatabase();

  updateDatabase();

  if (!drizzleConfig.out) {
    throw new Error('Migrations folder not configured in drizzle config');
  }

  if (!testDb) {
    throw new Error('Test database not initialized');
  }

  await migrate(testDb, { migrationsFolder: drizzleConfig.out });
  console.info('Test database migration completed');
};
