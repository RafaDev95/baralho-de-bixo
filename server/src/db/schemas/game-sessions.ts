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
import { decksTable } from './decks';
import { gameRoomsTable } from './game-rooms';
import { playersTable } from './players';

// Game session status enum
export const gameSessionStatusEnum = pgTable('game_session_status_enum', {
  status: text('status', {
    enum: ['active', 'finished', 'cancelled', 'paused'],
  }).primaryKey(),
});

// Game sessions table
export const gameSessionsTable = pgTable('game_sessions', {
  id: serial('id').primaryKey(),
  roomId: integer('room_id').references(() => gameRoomsTable.id, {
    onDelete: 'cascade',
  }),
  status: text('status', {
    enum: ['active', 'finished', 'cancelled', 'paused'],
  })
    .notNull()
    .default('active'),
  currentTurn: integer('current_turn').notNull().default(1),
  currentPlayerIndex: integer('current_player_index').notNull().default(0),
  phase: text('phase', {
    enum: ['draw', 'play', 'end'],
  })
    .notNull()
    .default('draw'),
  step: text('step', {
    enum: ['beginning'],
  })
    .notNull()
    .default('beginning'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date()
  ),
  startedAt: timestamp('started_at'),
  finishedAt: timestamp('finished_at'),
  winnerId: integer('winner_id').references(() => playersTable.id),
});

// Game players table (players in a specific game)
export const gamePlayersTable = pgTable('game_players', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id')
    .notNull()
    .references(() => gameSessionsTable.id, { onDelete: 'cascade' }),
  playerId: integer('player_id')
    .notNull()
    .references(() => playersTable.id),
  deckId: integer('deck_id').references(() => decksTable.id),
  playerIndex: integer('player_index').notNull(), // 0 or 1 for 2-player games
  lifeTotal: integer('life_total').notNull().default(20),
  energy: integer('energy').notNull().default(1), // Current energy (1-10)
  maxEnergy: integer('max_energy').notNull().default(1), // Maximum energy this turn
  handSize: integer('hand_size').notNull().default(0),
  deckSize: integer('deck_size').notNull().default(0),
  graveyardSize: integer('graveyard_size').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  hasMulliganed: boolean('has_mulliganed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

// Game cards table (cards in play during a game)
export const gameCardsTable = pgTable('game_cards', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id')
    .notNull()
    .references(() => gameSessionsTable.id, { onDelete: 'cascade' }),
  cardId: integer('card_id').notNull(), // References the original card
  ownerId: integer('owner_id')
    .notNull()
    .references(() => playersTable.id),
  controllerId: integer('controller_id')
    .notNull()
    .references(() => playersTable.id),
  location: text('location', {
    enum: ['hand', 'deck', 'graveyard', 'battlefield'],
  }).notNull(),
  zoneIndex: integer('zone_index'), // Position within the zone
  power: integer('power'),
  toughness: integer('toughness'),
  damage: integer('damage').default(0),
  counters: jsonb('counters'), // Store counters as JSON
  attachedTo: integer('attached_to'), // For auras/equipment
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

// Game actions table (log of all game actions)
export const gameActionsTable = pgTable('game_actions', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id')
    .notNull()
    .references(() => gameSessionsTable.id, { onDelete: 'cascade' }),
  playerId: integer('player_id')
    .notNull()
    .references(() => playersTable.id),
  actionType: text('action_type', {
    enum: [
      'play_card',
      'attack',
      'draw_card',
      'discard_card',
      'end_turn',
      'concede',
      'mulligan',
    ],
  }).notNull(),
  actionData: jsonb('action_data'), // Store action-specific data as JSON
  turnNumber: integer('turn_number').notNull(),
  phase: text('phase').notNull(),
  step: text('step').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// Game state snapshots table (for game replay/analysis)
export const gameStateSnapshotsTable = pgTable('game_state_snapshots', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id')
    .notNull()
    .references(() => gameSessionsTable.id, { onDelete: 'cascade' }),
  turnNumber: integer('turn_number').notNull(),
  phase: text('phase').notNull(),
  step: text('step').notNull(),
  gameState: jsonb('game_state').notNull(), // Complete game state as JSON
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// Schemas for validation
export const gameSessionsSchema = createSelectSchema(gameSessionsTable);
export type GameSession = typeof gameSessionsSchema._output

export const insertGameSessionSchema = createInsertSchema(
  gameSessionsTable
).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  startedAt: true,
  finishedAt: true,
  winnerId: true,
});

export const gamePlayersSchema = createSelectSchema(gamePlayersTable);
export type GamePlayer = typeof gamePlayersSchema._output

export const insertGamePlayerSchema = createInsertSchema(gamePlayersTable).omit(
  {
    createdAt: true,
    updatedAt: true,
    id: true,
  }
);

export const gameCardsSchema = createSelectSchema(gameCardsTable);
export type GameCard = typeof gameCardsSchema._output

export const insertGameCardSchema = createInsertSchema(gameCardsTable).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});

export const gameActionsSchema = createSelectSchema(gameActionsTable);
export type GameAction = typeof gameActionsSchema._output

export const insertGameActionSchema = createInsertSchema(gameActionsTable).omit(
  {
    id: true,
    timestamp: true,
  }
);

export const gameStateSnapshotsSchema = createSelectSchema(
  gameStateSnapshotsTable
);
export type GameStateSnapshot = typeof gameStateSnapshotsSchema._output

// Relations
export const gameSessionsRelations = relations(
  gameSessionsTable,
  ({ one, many }) => ({
    room: one(gameRoomsTable, {
      fields: [gameSessionsTable.roomId],
      references: [gameRoomsTable.id],
    }),
    players: many(gamePlayersTable),
    cards: many(gameCardsTable),
    actions: many(gameActionsTable),
    snapshots: many(gameStateSnapshotsTable),
    winner: one(playersTable, {
      fields: [gameSessionsTable.winnerId],
      references: [playersTable.id],
    }),
  })
);

export const gamePlayersRelations = relations(
  gamePlayersTable,
  ({ one, many }) => ({
    game: one(gameSessionsTable, {
      fields: [gamePlayersTable.gameId],
      references: [gameSessionsTable.id],
    }),
    player: one(playersTable, {
      fields: [gamePlayersTable.playerId],
      references: [playersTable.id],
    }),
    deck: one(decksTable, {
      fields: [gamePlayersTable.deckId],
      references: [decksTable.id],
    }),
    cards: many(gameCardsTable),
  })
);

export const gameCardsRelations = relations(gameCardsTable, ({ one }) => ({
  game: one(gameSessionsTable, {
    fields: [gameCardsTable.gameId],
    references: [gameSessionsTable.id],
  }),
  owner: one(playersTable, {
    fields: [gameCardsTable.ownerId],
    references: [playersTable.id],
  }),
  controller: one(playersTable, {
    fields: [gameCardsTable.controllerId],
    references: [playersTable.id],
  }),
}));

export const gameActionsRelations = relations(gameActionsTable, ({ one }) => ({
  game: one(gameSessionsTable, {
    fields: [gameActionsTable.gameId],
    references: [gameSessionsTable.id],
  }),
  player: one(playersTable, {
    fields: [gameActionsTable.playerId],
    references: [playersTable.id],
  }),
}));

// Update schemas
export const updateGameSessionSchema = insertGameSessionSchema.partial();
export const updateGamePlayerSchema = insertGamePlayerSchema.partial();
export const updateGameCardSchema = insertGameCardSchema.partial();

// Type exports
export type GameSessionStatus = 'active' | 'finished' | 'cancelled' | 'paused';
export type GamePhase = 'draw' | 'play' | 'end';
export type GameStep = 'beginning';
export type CardLocation = 'hand' | 'deck' | 'graveyard' | 'battlefield';
export type ActionType =
  | 'play_card'
  | 'attack'
  | 'draw_card'
  | 'discard_card'
  | 'end_turn'
  | 'concede'
  | 'mulligan';
