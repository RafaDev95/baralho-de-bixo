import {
	pgTable,
	serial,
	varchar,
	boolean,
	timestamp,
	integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { playersTable } from "./players";
import { deckCards } from "./deck-cards";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const decksTable = pgTable("decks", {
	id: serial("id").primaryKey(),
	playerId: integer("player_id"),
	name: varchar("name", { length: 255 }).notNull(),
	isActive: boolean("is_active").default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp({ mode: "date", precision: 3 }).$onUpdate(
		() => new Date(),
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
}));

export type DeckSchema = z.infer<typeof decksSchema>;
