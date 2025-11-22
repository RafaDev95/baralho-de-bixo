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
    validateRequiredFields(cardDefinition, ['power', 'toughness']);
    const power = validatePositiveNumber(cardDefinition.power, 'Power');
    const toughness = validatePositiveNumber(
      cardDefinition.toughness,
      'Toughness'
    );

    const card: CreatureCard = {
      ...cardDefinition,
      type: 'creature',
      power,
      toughness,
      abilities: cardDefinition.abilities || [],
      canAttack: true,
    };

    return card;
  }
}
