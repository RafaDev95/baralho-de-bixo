import type { CardColor } from '@/db/schemas';
import type { TypedCardDefinition } from '@/modules/cards/factory/card-definition-builder';

/**
 * Deck card entry with count
 */
export interface DeckCardEntry {
  card: TypedCardDefinition;
  count: number;
}

/**
 * Deck template definition
 */
export interface DeckTemplate {
  name: string;
  type: 'starter' | 'custom';
  colors: CardColor[];
  description: string;
  cards: DeckCardEntry[];
}

/**
 * Type-safe deck builder
 */
export const defineDeck = <T extends DeckTemplate>(deck: T) => {
  // Validate deck structure
  validateDeck(deck);
  
  return deck;
};

/**
 * Validate deck template
 */
function validateDeck(deck: DeckTemplate): void {
  if (!deck.name) {
    throw new Error('Deck must have a name');
  }
  
  if (!deck.type) {
    throw new Error('Deck must have a type');
  }
  
  if (!Array.isArray(deck.colors) || deck.colors.length === 0) {
    throw new Error('Deck must have at least one color');
  }
  
  if (!deck.description) {
    throw new Error('Deck must have a description');
  }
  
  if (!Array.isArray(deck.cards) || deck.cards.length === 0) {
    throw new Error('Deck must have at least one card');
  }
  
  // Validate card counts
  let totalCards = 0;
  for (const cardEntry of deck.cards) {
    if (!cardEntry.card) {
      throw new Error('Card entry must have a card definition');
    }
    
    if (!Number.isInteger(cardEntry.count) || cardEntry.count <= 0) {
      throw new Error(`Invalid card count for ${cardEntry.card.name}: ${cardEntry.count}. Must be a positive integer.`);
    }
    
    totalCards += cardEntry.count;
  }
  
  // Validate minimum deck size
  if (totalCards < 15) {
    throw new Error(`Deck must have at least 15 cards, found ${totalCards}`);
  }
  
  // Validate color identity
  for (const cardEntry of deck.cards) {
    const cardColors = cardEntry.card.colors;
    const hasValidColor = cardColors.some(color => deck.colors.includes(color));
    
    if (!hasValidColor) {
      throw new Error(`Card ${cardEntry.card.name} has colors ${cardColors.join(', ')} which don't match deck colors ${deck.colors.join(', ')}`);
    }
  }
}

/**
 * Get total card count in deck
 */
export function getDeckCardCount(deck: DeckTemplate): number {
  return deck.cards.reduce((total, cardEntry) => total + cardEntry.count, 0);
}

/**
 * Get unique cards in deck
 */
export function getUniqueCardCount(deck: DeckTemplate): number {
  return deck.cards.length;
}

/**
 * Check if deck is valid for play
 */
export function validateDeckForPlay(deck: DeckTemplate): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check minimum deck size
  const totalCards = getDeckCardCount(deck);
  if (totalCards < 15) {
    errors.push(`Deck must have at least 15 cards, found ${totalCards}`);
  }
  
  // Check maximum copies per card (4 copies max)
  for (const cardEntry of deck.cards) {
    if (cardEntry.count > 4) {
      errors.push(`Too many copies of ${cardEntry.card.name}: ${cardEntry.count} (maximum 4)`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
