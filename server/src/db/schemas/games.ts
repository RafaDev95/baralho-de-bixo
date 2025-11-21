import { relations } from 'drizzle-orm';
// server/src/db/schemas/games.ts
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { cardZoneEnum } from './enums';
import { playersTable } from './players';
import { triggeredAbilitiesTable } from './triggered-abilities';

export const gamesTable = pgTable('games', {
  id: serial('id').primaryKey(),
  player1Id: integer('player1_id').notNull(),
  player2Id: integer('player2_id').notNull(),
  currentTurn: integer('current_turn').default(1),
  currentPlayerId: integer('current_player_id').notNull(),
  phase: varchar('phase', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const turnsTable = pgTable('turns', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').notNull(),
  turnNumber: integer('turn_number').notNull(),
  playerId: integer('player_id').notNull(),
  phase: varchar('phase', { length: 20 }).notNull(),
  currentPhase: varchar('current_phase', { length: 20 }).notNull(),
  priorityPlayerId: integer('priority_player_id'),
  hasPlayedLand: boolean('has_played_land').default(false),
  hasAttacked: boolean('has_attacked').default(false),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  endedAt: timestamp('ended_at'),
});

export const stackTable = pgTable('stack', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').notNull(),
  cardId: integer('card_id').notNull(),
  playerId: integer('player_id').notNull(),
  position: integer('position').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const turnActionsTable = pgTable('turn_actions', {
  id: serial('id').primaryKey(),
  turnId: integer('turn_id').notNull(),
  playerId: integer('player_id').notNull(),
  actionType: varchar('action_type', { length: 50 }).notNull(),
  cardId: integer('card_id'),
  targetId: integer('target_id'),
  actionData: jsonb('action_data'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const gameStatesTable = pgTable('game_states', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').notNull(),
  playerId: integer('player_id').notNull(),
  handSize: integer('hand_size').notNull(),
  deckSize: integer('deck_size').notNull(),
  graveyardSize: integer('graveyard_size').notNull(),
  lifeTotal: integer('life_total').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const combatStatesTable = pgTable('combat_states', {
  id: serial('id').primaryKey(),
  turnId: integer('turn_id').notNull(),
  attackerId: integer('attacker_id').notNull(),
  blockerId: integer('blocker_id'),
  damageAmount: integer('damage_amount').notNull(),
  isBlocked: boolean('is_blocked').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const cardPositionsTable = pgTable('card_positions', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').notNull(),
  cardId: integer('card_id').notNull(),
  playerId: integer('player_id').notNull(),
  zone: cardZoneEnum().notNull(),
  position: integer('position'),
  isTapped: boolean('is_tapped').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});


// Relations
export const gamesRelations = relations(gamesTable, ({ one, many }) => ({
  player1: one(playersTable, {
    fields: [gamesTable.player1Id],
    references: [playersTable.id],
  }),
  player2: one(playersTable, {
    fields: [gamesTable.player2Id],
    references: [playersTable.id],
  }),
  currentPlayer: one(playersTable, {
    fields: [gamesTable.currentPlayerId],
    references: [playersTable.id],
  }),
  turns: many(turnsTable),
  gameStates: many(gameStatesTable),
  cardPositions: many(cardPositionsTable),
  stack: many(stackTable),
  triggeredAbilities: many(triggeredAbilitiesTable),
}));

export const turnsRelations = relations(turnsTable, ({ one, many }) => ({
  game: one(gamesTable, {
    fields: [turnsTable.gameId],
    references: [gamesTable.id],
  }),
  player: one(playersTable, {
    fields: [turnsTable.playerId],
    references: [playersTable.id],
  }),
  actions: many(turnActionsTable),
  combatStates: many(combatStatesTable),
}));
