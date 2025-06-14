import {
	pgTable,
	timestamp,
	varchar,
	pgEnum,
	integer,
	uuid,
	serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { decksTable } from "./decks";
import { tradesTable } from "./trades";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const playersTable = pgTable("players", {
	id: serial("id").primaryKey(),
	wallet_address: varchar("wallet_address", { length: 42 }).notNull().unique(),
	username: varchar("username", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	balance: integer("balance").default(0),
	rank: integer("rank").default(0),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp({ mode: "date", precision: 3 }).$onUpdate(
		() => new Date(),
	),
});

export const playersSchema = createSelectSchema(playersTable);
export const insertPlayerSchema = createInsertSchema(playersTable).omit({
	createdAt: true,
	updatedAt: true,
	id: true,
});

export const playersRelations = relations(playersTable, ({ many }) => ({
	decks: many(decksTable),
	trades: many(tradesTable),
}));

export type PlayerSchema = z.infer<typeof playersSchema>;
