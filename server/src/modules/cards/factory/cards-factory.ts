import { BASE_CARD_REQUIRED_FIELDS } from './constants';
import type {
  CardDefinition,
  CreatureCard,
  SpellCard,
  EnchantmentCard,
  ArtifactCard,
} from './types';

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
  /**
   * Create a creature card
   */
  static createCreature(
    name: string,
    energyCost: number,
    power: number,
    toughness: number,
    options?: {
      rarity?: CardDefinition['rarity'];
      description?: string;
      abilities?: CardDefinition['abilities'];
    }
  ): CreatureCard {
    const card: CreatureCard = {
      name,
      type: 'creature',
      energyCost,
      power,
      toughness,
      rarity: options?.rarity ?? 'common',
      description: options?.description ?? '',
      canAttack: true,
      abilities: options?.abilities,
    };

    CardFactory.validateBaseCard(card);
    return card;
  }

  /**
   * Create a spell card
   */
  static createSpell(
    name: string,
    energyCost: number,
    effect: SpellCard['effect'],
    options?: {
      rarity?: CardDefinition['rarity'];
      energyCost?: number;
      description?: string;
    }
  ): SpellCard {
    const card: SpellCard = {
      name,
      type: 'spell',
      energyCost: options?.energyCost ?? energyCost,
      effect,
      rarity: options?.rarity ?? 'common',
      description: options?.description ?? '',
    };

    CardFactory.validateBaseCard(card);
    return card;
  }

  /**
   * Create an enchantment card
   */
  static createEnchantment(
    name: string,
    energyCost: number,
    abilities: EnchantmentCard['abilities'],
    options?: {
      rarity?: CardDefinition['rarity'];
      energyCost?: number;
      description?: string;
    }
  ): EnchantmentCard {
    const card: EnchantmentCard = {
      name,
      type: 'enchantment',
      energyCost: options?.energyCost ?? energyCost,
      abilities,
      rarity: options?.rarity ?? 'common',
      description: options?.description ?? '',
    };

    CardFactory.validateBaseCard(card);
    return card;
  }

  /**
   * Create an artifact card
   */
  static createArtifact(
    name: string,
    energyCost: number,
    abilities: ArtifactCard['abilities'],
    options?: {
      rarity?: CardDefinition['rarity'];
      energyCost?: number;
      description?: string;
    }
  ): ArtifactCard {
    const card: ArtifactCard = {
      name,
      type: 'artifact',
      energyCost: options?.energyCost ?? energyCost,
      abilities,
      rarity: options?.rarity ?? 'common',
      description: options?.description ?? '',
    };

    CardFactory.validateBaseCard(card);
    return card;
  }

  /**
   * Generic card creation (for backward compatibility)
   */
  static createCard(cardData: CardDefinition): CardDefinition {
    CardFactory.validateBaseCard(cardData);
    return cardData;
  }

  private static validateBaseCard(card: CardDefinition): void {
    for (const field of BASE_CARD_REQUIRED_FIELDS) {
      if (card[field] === undefined || card[field] === null) {
        throw new Error(`Card must have a ${field}`);
      }
    }

    // Validate energy cost
    if (
      typeof card.energyCost !== 'number' ||
      card.energyCost < 0 ||
      card.energyCost > 10
    ) {
      throw new Error('Card energy cost must be a number between 0 and 10');
    }
  }
}
