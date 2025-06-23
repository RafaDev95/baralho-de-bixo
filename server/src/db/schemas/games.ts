// server/src/db/schemas/games.ts
import {
	pgTable,
	serial,
	integer,
	varchar,
	timestamp,
	jsonb,
	boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { playersTable } from "./players";
import { cardZoneEnum } from "./cards";
import { triggeredAbilitiesTable } from "./triggered-abilities";

export const gamesTable = pgTable("games", {
	id: serial("id").primaryKey(),
	player1_id: integer("player1_id").notNull(),
	player2_id: integer("player2_id").notNull(),
	current_turn: integer("current_turn").default(1),
	current_player_id: integer("current_player_id").notNull(),
	phase: varchar("phase", { length: 20 }).notNull(),
	status: varchar("status", { length: 20 }).notNull().default("active"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at"),
});

export const turnsTable = pgTable("turns", {
	id: serial("id").primaryKey(),
	game_id: integer("game_id").notNull(),
	turn_number: integer("turn_number").notNull(),
	player_id: integer("player_id").notNull(),
	phase: varchar("phase", { length: 20 }).notNull(),
	current_phase: varchar("current_phase", { length: 20 }).notNull(),
	priority_player_id: integer("priority_player_id"),
	has_played_land: boolean("has_played_land").default(false),
	has_attacked: boolean("has_attacked").default(false),
	startedAt: timestamp("started_at").notNull().defaultNow(),
	endedAt: timestamp("ended_at"),
});

export const stackTable = pgTable("stack", {
	id: serial("id").primaryKey(),
	game_id: integer("game_id").notNull(),
	card_id: integer("card_id").notNull(),
	player_id: integer("player_id").notNull(),
	position: integer("position").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const turnActionsTable = pgTable("turn_actions", {
	id: serial("id").primaryKey(),
	turn_id: integer("turn_id").notNull(),
	player_id: integer("player_id").notNull(),
	action_type: varchar("action_type", { length: 50 }).notNull(),
	card_id: integer("card_id"),
	target_id: integer("target_id"),
	action_data: jsonb("action_data"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gameStatesTable = pgTable("game_states", {
	id: serial("id").primaryKey(),
	game_id: integer("game_id").notNull(),
	player_id: integer("player_id").notNull(),
	hand_size: integer("hand_size").notNull(),
	deck_size: integer("deck_size").notNull(),
	graveyard_size: integer("graveyard_size").notNull(),
	life_total: integer("life_total").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at"),
});

export const combatStatesTable = pgTable("combat_states", {
	id: serial("id").primaryKey(),
	turn_id: integer("turn_id").notNull(),
	attacker_id: integer("attacker_id").notNull(),
	blocker_id: integer("blocker_id"),
	damage_amount: integer("damage_amount").notNull(),
	is_blocked: boolean("is_blocked").default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cardPositionsTable = pgTable("card_positions", {
	id: serial("id").primaryKey(),
	game_id: integer("game_id").notNull(),
	card_id: integer("card_id").notNull(),
	player_id: integer("player_id").notNull(),
	zone: cardZoneEnum().notNull(),
	position: integer("position"),
	is_tapped: boolean("is_tapped").default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at"),
});

export const manaPoolsTable = pgTable("mana_pools", {
	id: serial("id").primaryKey(),
	game_id: integer("game_id").notNull(),
	player_id: integer("player_id").notNull(),
	fire_mana: integer("fire_mana").default(0),
	water_mana: integer("water_mana").default(0),
	wind_mana: integer("wind_mana").default(0),
	generic_mana: integer("generic_mana").default(0),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at"),
});

// Relations
export const gamesRelations = relations(gamesTable, ({ one, many }) => ({
	player1: one(playersTable, {
		fields: [gamesTable.player1_id],
		references: [playersTable.id],
	}),
	player2: one(playersTable, {
		fields: [gamesTable.player2_id],
		references: [playersTable.id],
	}),
	currentPlayer: one(playersTable, {
		fields: [gamesTable.current_player_id],
		references: [playersTable.id],
	}),
	turns: many(turnsTable),
	gameStates: many(gameStatesTable),
	manaPools: many(manaPoolsTable),
	cardPositions: many(cardPositionsTable),
	stack: many(stackTable),
	triggeredAbilities: many(triggeredAbilitiesTable),
}));

export const turnsRelations = relations(turnsTable, ({ one, many }) => ({
	game: one(gamesTable, {
		fields: [turnsTable.game_id],
		references: [gamesTable.id],
	}),
	player: one(playersTable, {
		fields: [turnsTable.player_id],
		references: [playersTable.id],
	}),
	actions: many(turnActionsTable),
	combatStates: many(combatStatesTable),
}));
