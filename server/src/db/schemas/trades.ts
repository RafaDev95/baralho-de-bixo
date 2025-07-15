import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { cardsTable } from './cards';
import { playersTable } from './players';

export const tradesTable = pgTable('trades', {
  id: serial('id').primaryKey(),
  sellerId: integer('seller_id'),
  buyerId: integer('buyer_id'),
  cardId: integer('card_id'),
  price: integer('price').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('open'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date()
  ),
  completedAt: timestamp({ mode: 'date', precision: 3 }),
});

export const tradesSchema = createSelectSchema(tradesTable);
export const insertTradeSchema = createInsertSchema(tradesTable).omit({
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  id: true,
});

export const tradesRelations = relations(tradesTable, ({ one }) => ({
  seller: one(playersTable, {
    fields: [tradesTable.sellerId],
    references: [playersTable.id],
  }),
  buyer: one(playersTable, {
    fields: [tradesTable.buyerId],
    references: [playersTable.id],
  }),
  card: one(cardsTable, {
    fields: [tradesTable.cardId],
    references: [cardsTable.id],
  }),
}));

export type TradeSchema = z.infer<typeof tradesSchema>;
