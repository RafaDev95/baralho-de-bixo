import {
  validatePositiveNumber,
  validateRequiredFields,
} from '../../utils/validations';
import type {
  CardDefinition,
  CardFactoryStrategy,
  CreatureCard,
} from '../types';

export class CreatureCardFactory implements CardFactoryStrategy {
  createCard(cardDefinition: CardDefinition): CreatureCard {
    validateRequiredFields(cardDefinition, ['power', 'health']);
    const power = validatePositiveNumber(cardDefinition.power, 'Power');
    const health = validatePositiveNumber(cardDefinition.health, 'Health');

    const card: CreatureCard = {
      ...cardDefinition,
      type: 'creature',
      power,
      health,
      abilities: cardDefinition.abilities || [],
      canAttack: true,
      canBlock: true,
      hasSummoningSickness: true,
    };

    return card;
  }
}
