import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { gamesTable } from "./games";
import { relations } from "drizzle-orm";
import { cardsTable } from "./cards";

export const attachmentsTable = pgTable("attachments", {
	id: serial("id").primaryKey(),
	gameId: integer("game_id").notNull(),
	sourceId: integer("source_id").notNull(), // The attachment card
	targetId: integer("target_id").notNull(), // The card it's attached to
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const attachmentsRelations = relations(attachmentsTable, ({ one }) => ({
	game: one(gamesTable, {
		fields: [attachmentsTable.gameId],
		references: [gamesTable.id],
	}),
	source: one(cardsTable, {
		fields: [attachmentsTable.sourceId],
		references: [cardsTable.id],
	}),
	target: one(cardsTable, {
		fields: [attachmentsTable.targetId],
		references: [cardsTable.id],
	}),
}));
