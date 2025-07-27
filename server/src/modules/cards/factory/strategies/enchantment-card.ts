import { validateRequiredFields } from '../../utils/validations';
import type {
  CardDefinition,
  CardFactoryStrategy,
  EnchantmentCard,
} from '../types';

export class EnchantmentCardFactory implements CardFactoryStrategy {
  createCard(cardDefinition: CardDefinition): EnchantmentCard {
    validateRequiredFields(cardDefinition, ['abilities']);

    const card: EnchantmentCard = {
      ...cardDefinition,
      type: 'enchantment',
      abilities: cardDefinition.abilities!,
    };
    return card;
  }
}
