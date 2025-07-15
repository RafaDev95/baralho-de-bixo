import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { cardsTable } from './cards';
import { decksTable } from './decks';

export const deckCards = pgTable('deck_cards', {
  id: serial('id').primaryKey(),
  deckId: integer('deck_id'),
  cardId: integer('card_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const deckCardsRelations = relations(deckCards, ({ one }) => ({
  deck: one(decksTable, {
    fields: [deckCards.deckId],
    references: [decksTable.id],
  }),
  card: one(cardsTable, {
    fields: [deckCards.cardId],
    references: [cardsTable.id],
  }),
}));
