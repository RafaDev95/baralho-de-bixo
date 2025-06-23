import { relations } from "drizzle-orm";
import {
	pgTable,
	serial,
	text,
	timestamp,
	pgEnum,
	integer,
	boolean,
	jsonb,
} from "drizzle-orm/pg-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { deckCards } from "./deck-cards";
import { tradesTable } from "./trades";
import { cardPositionsTable, stackTable } from "./games";
import { attachmentsTable } from "./attachmentsTable";

export const attributeEnum = pgEnum("attribute", ["fire", "water", "wind"]);
export const typeEnum = pgEnum("type", [
	"creature",
	"spell",
	"enchantment",
	"artifact",
]);
export const rarityEnum = pgEnum("rarity", [
	"common",
	"uncommon",
	"rare",
	"epic",
]);
export const cardZoneEnum = pgEnum("card_zone", [
	"library",
	"hand",
	"battlefield",
	"graveyard",
	"exile",
	"stack",
]);

export const cardsTable = pgTable("cards", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	type: typeEnum().notNull(),
	rarity: rarityEnum().notNull(),
	description: text("description").notNull(),
	attributes: attributeEnum().notNull(),
	power: integer("power"),
	health: integer("health"),
	mana_cost: jsonb("mana_cost").notNull(), // Store as {fire: 1, water: 0, wind: 0, generic: 2}
	abilities: jsonb("abilities"), // Store card abilities
	isLegendary: boolean("is_legendary").default(false),
	isToken: boolean("is_token").default(false),
	// Add fields for creature-specific properties
	can_attack: boolean("can_attack").default(true),
	can_block: boolean("can_block").default(true),
	has_summoning_sickness: boolean("has_summoning_sickness").default(true),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp({ mode: "date", precision: 3 }).$onUpdate(
		() => new Date(),
	),
});

// Track counters on cards
export const cardCountersTable = pgTable("card_counters", {
	id: serial("id").primaryKey(),
	gameId: integer("game_id").notNull(),
	cardId: integer("card_id").notNull(),
	counter_type: text("counter_type").notNull(),
	amount: integer("amount").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp({ mode: "date", precision: 3 }).$onUpdate(
		() => new Date(),
	),
});

export const cardsSchema = createSelectSchema(cardsTable);
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
	attachments: many(attachmentsTable),
	stack: many(stackTable),
}));

export const updateCardSchema = insertCardSchema.partial();

export type CardSchema = z.infer<typeof cardsSchema>;
export type CardType = (typeof typeEnum.enumValues)[number];
export type CardRarity = (typeof rarityEnum.enumValues)[number];
export type CardAttribute = (typeof attributeEnum.enumValues)[number];
