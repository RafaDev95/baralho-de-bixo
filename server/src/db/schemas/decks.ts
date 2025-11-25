import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { deckCards } from './deck-cards';
import { gameRoomPlayersTable } from './game-rooms';
import { playersTable } from './players';

export const deckTypeEnum = pgEnum('deck_type', ['starter', 'custom']);

export const decksTable = pgTable('decks', {
  id: serial('id').primaryKey(),
  playerId: integer('player_id'),
  name: varchar('name', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(false),
  cardCount: integer('card_count').notNull().default(0),
  type: integer('type').notNull(),
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
  gameRooms: many(gameRoomPlayersTable),
}));

export type Deck = typeof decksSchema._output;
