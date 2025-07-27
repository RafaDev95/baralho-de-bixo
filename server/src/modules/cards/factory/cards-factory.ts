import { BASE_CARD_REQUIRED_FIELDS } from './constants';
import type { CardDefinition, CardFactoryStrategy } from './types';

export class CardFactory {
  private CreateCardStrategy: CardFactoryStrategy;

  constructor(createCardStrategy: CardFactoryStrategy) {
    this.CreateCardStrategy = createCardStrategy;
  }

  createCard(cardData: CardDefinition) {
    CardFactory.validateBaseCard(cardData);
    return this.CreateCardStrategy.createCard(cardData);
  }

  private static validateBaseCard(card: CardDefinition): void {
    for (const field of BASE_CARD_REQUIRED_FIELDS) {
      if (!card[field]) throw new Error(`Card must have a ${field}`);
    }
  }
}
