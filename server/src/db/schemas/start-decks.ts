import {
	pgTable,
	serial,
	text,
	timestamp,
	integer,
	pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { cardsTable } from "./cards";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const strategyTypeEnum = pgEnum("strategy_type", [
	"aggressive",
	"defensive",
	"balanced",
]);

export const difficultyLevelEnum = pgEnum("difficulty_level", [
	"easy",
	"medium",
	"hard",
]);

export const starterDecksTable = pgTable("starter_decks", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	strategy_type: strategyTypeEnum(),
	difficulty_level: difficultyLevelEnum(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp({ mode: "date", precision: 3 }).$onUpdate(
		() => new Date(),
	),
});

export const starterDeckCardsTable = pgTable("starter_deck_cards", {
	id: serial("id").primaryKey(),
	starter_deck_id: integer("starter_deck_id").notNull(),
	card_id: integer("card_id").notNull(),
	quantity: integer("quantity").notNull().default(1),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const starterDecksRelations = relations(
	starterDecksTable,
	({ many }) => ({
		cards: many(starterDeckCardsTable),
	}),
);

export const starterDeckCardsRelations = relations(
	starterDeckCardsTable,
	({ one }) => ({
		starterDeck: one(starterDecksTable, {
			fields: [starterDeckCardsTable.starter_deck_id],
			references: [starterDecksTable.id],
		}),
		card: one(cardsTable, {
			fields: [starterDeckCardsTable.card_id],
			references: [cardsTable.id],
		}),
	}),
);

// Zod schemas
export const starterDecksSchema = createSelectSchema(starterDecksTable);
export const insertStarterDeckSchema = createInsertSchema(
	starterDecksTable,
).omit({
	createdAt: true,
	updatedAt: true,
	id: true,
});

export type StarterDeckSchema = z.infer<typeof starterDecksSchema>;
