import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { deckCards } from './deck-cards';
import { type colorEnum, rarityEnum, typeEnum } from './enums';
import { cardPositionsTable, stackTable } from './games';
import { tradesTable } from './trades';

export const cardsTable = pgTable('cards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: typeEnum().notNull(),
  rarity: rarityEnum().notNull(),
  description: text('description').notNull(),
  colors: jsonb('colors').notNull(), // Store as array of color strings
  power: integer('power'),
  toughness: integer('toughness'),
  manaCost: jsonb('mana_cost').notNull(), // Store as {red: 1, blue: 0, green: 0, generic: 2}
  abilities: jsonb('abilities'), // Store card abilities
  effect: jsonb('effect'), // Store card effect
  // Add fields for creature-specific properties
  canAttack: boolean('can_attack').default(true),
  canBlock: boolean('can_block').default(true),
  hasSummoningSickness: boolean('has_summoning_sickness').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

// Track counters on cards
export const cardCountersTable = pgTable('card_counters', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').notNull(),
  cardId: integer('card_id').notNull(),
  counter_type: text('counter_type').notNull(),
  amount: integer('amount').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const cardsSchema = createSelectSchema(cardsTable);
export type Card = z.infer<typeof cardsSchema>;
export const insertCardSchema = createInsertSchema(cardsTable).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});

export const cardsRelations = relations(cardsTable, ({ many }) => ({
  deckCards: many(deckCards),
  trades: many(tradesTable),
  positions: many(cardPositionsTable),
  counters: many(cardCountersTable),
  stack: many(stackTable),
}));

export const updateCardSchema = insertCardSchema.partial();

export type CardSchema = z.infer<typeof cardsSchema>;
export type CardType = (typeof typeEnum.enumValues)[number];
export type CardRarity = (typeof rarityEnum.enumValues)[number];
export type CardColor = (typeof colorEnum.enumValues)[number];
