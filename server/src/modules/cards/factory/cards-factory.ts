import { BASE_CARD_REQUIRED_FIELDS } from './constants';
import type { CardDefinition, CardFactoryStrategy, CardBase } from './types';

/**
 * CardFactory - Factory Pattern Implementation
 * Centralizes card creation logic using static factory methods.
 * Each card type has its own factory method that ensures proper initialization.
 * Benefits:
 * - Single responsibility: All card creation in one place
 * - Easy to extend: Add new card types by adding new factory methods
 * - Type safety: Each factory method returns the correct card type
 * - Validation: Ensures cards are created with required fields
 */
export class CardFactory {
  private readonly cardFactoryStrategy: CardFactoryStrategy;

  constructor(cardFactoryStrategy: CardFactoryStrategy) {
    this.cardFactoryStrategy = cardFactoryStrategy;
  }

  createCard(cardData: CardDefinition): CardBase {
    this.validateBaseCard(cardData);
    return this.cardFactoryStrategy.createCard(cardData);
  }

  private validateBaseCard(card: CardDefinition): void {
    for (const field of BASE_CARD_REQUIRED_FIELDS) {
      if (card[field] === undefined || card[field] === null) {
        throw new Error(`Card must have a ${field}`);
      }
    }

    if (
      typeof card.energyCost !== 'number' ||
      card.energyCost < 0 ||
      card.energyCost > 10
    ) {
      throw new Error('Card energy cost must be a number between 0 and 10');
    }
  }
}
