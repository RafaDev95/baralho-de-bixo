import type {
  ArtifactCard,
  CardDefinition,
  CreatureCard,
  EnchantmentCard,
  SpellCard,
} from './types';

const validateRequiredFields = (
  cardDefinition: CardDefinition,
  requiredFields: (keyof CardDefinition)[]
) => {
  for (const field of requiredFields) {
    if (!cardDefinition[field])
      throw new Error(
        `Missing ${field} for ${cardDefinition.type} card ${cardDefinition.name}`
      );
  }
};

const validatePositiveNumber = (
  value: number | undefined,
  fieldName: string
) => {
  if (value === undefined) throw new Error(`Missing ${fieldName}`);
  if (value < 0) throw new Error(`${fieldName} must be positive`);
  return value;
};

export class CreateCardByTypeStrategy {
  static creatureCard(cardDefinition: CardDefinition): CreatureCard {
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

  static spellCard(cardDefinition: CardDefinition): SpellCard {
    validateRequiredFields(cardDefinition, ['effect']);

    const card: SpellCard = {
      ...cardDefinition,
      type: 'spell',
      effect: cardDefinition.effect!,
    };
    return card;
  }

  static enchantmentCard(cardDefinition: CardDefinition): EnchantmentCard {
    validateRequiredFields(cardDefinition, ['effect', 'duration']);

    const card: EnchantmentCard = {
      ...cardDefinition,
      type: 'enchantment',
      effect: cardDefinition.effect!,
      duration: cardDefinition.duration!,
    };

    return card;
  }

  static artifactCard(cardDefinition: CardDefinition): ArtifactCard {
    validateRequiredFields(cardDefinition, ['effect']);

    const isEquipment =
      cardDefinition.isEquipment ?? !!cardDefinition.equipEffect;

    const card: ArtifactCard = {
      ...cardDefinition,
      type: 'artifact',
      effect: cardDefinition.effect!,
      isEquipment,
    };

    return card;
  }
}
