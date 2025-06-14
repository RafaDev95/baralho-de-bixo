import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { deckCards } from "./deck-cards";
import { tradesTable } from "./trades";

export const attributeEnum = pgEnum("attribute", ["fire", "water", "wind"]);

export const cardsTable = pgTable("cards", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	type: text("type").notNull(),
	rarity: text("rarity").notNull(),
	attributes: attributeEnum(),
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
}));

export const updateCardSchema = insertCardSchema.partial();

export type CardSchema = z.infer<typeof cardsSchema>;
