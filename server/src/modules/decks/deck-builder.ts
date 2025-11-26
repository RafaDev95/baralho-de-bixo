import type { TypedCardDefinition } from '@/modules/cards/factory/card-definition-builder';

export interface DeckCardEntry {
  card: TypedCardDefinition;
  count: number;
}

export interface DeckTemplate {
  name: string;
  type: 'starter' | 'custom';
  description: string;
  cards: DeckCardEntry[];
}

export const defineDeck = <T extends DeckTemplate>(deck: T) => {
  validateDeck(deck);

  return deck;
};

function validateDeck(deck: DeckTemplate): void {
  if (!deck.name) {
    throw new Error('Deck must have a name');
  }

  if (!deck.type) {
    throw new Error('Deck must have a type');
  }

  if (!deck.description) {
    throw new Error('Deck must have a description');
  }

  if (!Array.isArray(deck.cards) || deck.cards.length === 0) {
    throw new Error('Deck must have at least one card');
  }

  let totalCards = 0;
  for (const cardEntry of deck.cards) {
    if (!cardEntry.card) {
      throw new Error('Card entry must have a card definition');
    }

    if (!Number.isInteger(cardEntry.count) || cardEntry.count <= 0) {
      throw new Error(
        `Invalid card count for ${cardEntry.card.name}: ${cardEntry.count}. Must be a positive integer.`
      );
    }

    totalCards += cardEntry.count;
  }

  if (totalCards < 15) {
    throw new Error(`Deck must have at least 15 cards, found ${totalCards}`);
  }
}

export function getDeckCardCount(deck: DeckTemplate): number {
  return deck.cards.reduce((total, cardEntry) => total + cardEntry.count, 0);
}

export function validateDeckForPlay(deck: DeckTemplate): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const totalCards = getDeckCardCount(deck);
  if (totalCards < 15) {
    errors.push(`Deck must have at least 15 cards, found ${totalCards}`);
  }

  for (const cardEntry of deck.cards) {
    if (cardEntry.count > 4) {
      errors.push(
        `Too many copies of ${cardEntry.card.name}: ${cardEntry.count} (maximum 4)`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
