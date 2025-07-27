import { validateRequiredFields } from '../../utils/validations';
import type { CardDefinition, CardFactoryStrategy, SpellCard } from '../types';

export class SpellCardFactory implements CardFactoryStrategy {
  createCard(cardDefinition: CardDefinition): SpellCard {
    validateRequiredFields(cardDefinition, ['effect']);

    const card: SpellCard = {
      ...cardDefinition,
      type: 'spell',
      effect: cardDefinition.effect!,
    };
    return card;
  }
}
