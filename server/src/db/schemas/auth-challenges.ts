import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const authChallengesTable = pgTable('auth_challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: varchar('address', { length: 42 }).notNull(),
  nonce: varchar('nonce', { length: 255 }).notNull().unique(),
  message: varchar('message', { length: 1000 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const authChallengesSchema = createSelectSchema(authChallengesTable);
export const insertAuthChallengeSchema = createInsertSchema(
  authChallengesTable
).omit({
  id: true,
  createdAt: true,
});

export type AuthChallengeSchema = z.infer<typeof authChallengesSchema>;
