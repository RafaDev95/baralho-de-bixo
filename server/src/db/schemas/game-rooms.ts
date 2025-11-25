import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { decksTable } from './decks';
import { playersTable } from './players';

export const gameRoomStatusEnum = pgTable('game_room_status_enum', {
  status: text('status', {
    enum: ['waiting', 'in_progress', 'finished', 'cancelled'],
  }).primaryKey(),
});

export const gameRoomsTable = pgTable('game_rooms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  status: text('status', {
    enum: ['waiting', 'in_progress', 'finished', 'cancelled'],
  })
    .notNull()
    .default('waiting'),
  maxPlayers: integer('max_players').notNull().default(2),
  currentPlayers: integer('current_players').notNull().default(0),
  createdBy: integer('created_by').notNull(), // Player ID who created the room
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const gameRoomPlayersTable = pgTable('game_room_players', {
  id: serial('id').primaryKey(),
  roomId: integer('room_id')
    .notNull()
    .references(() => gameRoomsTable.id, { onDelete: 'cascade' }),
  playerId: integer('player_id')
    .notNull()
    .references(() => playersTable.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  isReady: text('is_ready', { enum: ['ready', 'not_ready'] })
    .notNull()
    .default('not_ready'),
  deckId: integer('deck_id').references(() => decksTable.id, {
    onDelete: 'set null',
  }),
});

export const gameRoomsSchema = createSelectSchema(gameRoomsTable);
export type GameRoom = typeof gameRoomsSchema._output;

export const insertGameRoomSchema = createInsertSchema(gameRoomsTable).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  currentPlayers: true,
});

export const gameRoomPlayersSchema = createSelectSchema(gameRoomPlayersTable);
export type GameRoomPlayer = typeof gameRoomPlayersSchema._output;

export const insertGameRoomPlayerSchema = createInsertSchema(
  gameRoomPlayersTable
).omit({
  id: true,
  joinedAt: true,
});

export const gameRoomsRelations = relations(gameRoomsTable, ({ many }) => ({
  players: many(gameRoomPlayersTable),
}));

export const gameRoomPlayersRelations = relations(
  gameRoomPlayersTable,
  ({ one }) => ({
    room: one(gameRoomsTable, {
      fields: [gameRoomPlayersTable.roomId],
      references: [gameRoomsTable.id],
    }),
    player: one(playersTable, {
      fields: [gameRoomPlayersTable.playerId],
      references: [playersTable.id],
    }),
    deck: one(decksTable, {
      fields: [gameRoomPlayersTable.deckId],
      references: [decksTable.id],
    }),
  })
);

export const updateGameRoomSchema = insertGameRoomSchema.partial();
export const updateGameRoomPlayerSchema = insertGameRoomPlayerSchema.partial();

export type GameRoomStatus =
  | 'waiting'
  | 'in_progress'
  | 'finished'
  | 'cancelled';
export type PlayerReadyStatus = 'ready' | 'not_ready';
