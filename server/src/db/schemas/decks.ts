import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { deckCards } from './deck-cards';
import { playersTable } from './players';

export const decksTable = pgTable('decks', {
  id: serial('id').primaryKey(),
  playerId: integer('player_id'),
  name: varchar('name', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const decksSchema = createSelectSchema(decksTable);
export const insertDeckSchema = createInsertSchema(decksTable).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});

export const decksRelations = relations(decksTable, ({ one, many }) => ({
  player: one(playersTable, {
    fields: [decksTable.playerId],
    references: [playersTable.id],
  }),
  cards: many(deckCards),
}));

export type DeckSchema = z.infer<typeof decksSchema>;
