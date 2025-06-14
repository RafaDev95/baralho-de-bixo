import { pgTable, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { decksTable } from "./decks";
import { cardsTable } from "./cards";

export const deckCards = pgTable("deck_cards", {
	id: serial("id").primaryKey(),
	deck_id: integer("deck_id"),
	card_id: integer("card_id"),
	created_at: timestamp("created_at").defaultNow(),
});

export const deckCardsRelations = relations(deckCards, ({ one }) => ({
	deck: one(decksTable, {
		fields: [deckCards.deck_id],
		references: [decksTable.id],
	}),
	card: one(cardsTable, {
		fields: [deckCards.card_id],
		references: [cardsTable.id],
	}),
}));
