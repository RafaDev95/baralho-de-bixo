import {
	pgTable,
	varchar,
	integer,
	timestamp,
	serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { playersTable } from "./players";
import { cardsTable } from "./cards";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const tradesTable = pgTable("trades", {
	id: serial("id").primaryKey(),
	seller_id: integer("seller_id"),
	buyer_id: integer("buyer_id"),
	card_id: integer("card_id"),
	price: integer("price").notNull(),
	status: varchar("status", { length: 50 }).notNull().default("open"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp({ mode: "date", precision: 3 }).$onUpdate(
		() => new Date(),
	),
	completedAt: timestamp("completed_at"),
});

export const tradesSchema = createSelectSchema(tradesTable);
export const insertTradeSchema = createInsertSchema(tradesTable).omit({
	createdAt: true,
	updatedAt: true,
	completedAt: true,
	id: true,
});

export const tradesRelations = relations(tradesTable, ({ one }) => ({
	seller: one(playersTable, {
		fields: [tradesTable.seller_id],
		references: [playersTable.id],
	}),
	buyer: one(playersTable, {
		fields: [tradesTable.buyer_id],
		references: [playersTable.id],
	}),
	card: one(cardsTable, {
		fields: [tradesTable.card_id],
		references: [cardsTable.id],
	}),
}));

export type TradeSchema = z.infer<typeof tradesSchema>;
