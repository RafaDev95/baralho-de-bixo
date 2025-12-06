import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { decksTable } from './decks';
import { gameRoomPlayersTable } from './game-rooms';

export const playersTable = pgTable('players', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  balance: integer('balance').default(0),
  rank: integer('rank').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const playersSchema = createSelectSchema(playersTable);
export const insertPlayerSchema = createInsertSchema(playersTable)
  .omit({
    createdAt: true,
    updatedAt: true,
    passwordHash: true,
    id: true,
  })
  .extend({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password is too long'),
  });

export const playersRelations = relations(playersTable, ({ many }) => ({
  decks: many(decksTable),
  gameRooms: many(gameRoomPlayersTable),
}));

export type Player = typeof playersSchema._output;
