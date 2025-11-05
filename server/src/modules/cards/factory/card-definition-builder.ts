import type { CardType, CardRarity, CardColor } from '@/db/schemas';
import type { CardDefinition, CardAbility, ManaCost } from './types';

/**
 * Type-safe mana cost definition
 */
export interface ManaCostDefinition {
  red?: number;
  blue?: number;
  green?: number;
  white?: number;
  black?: number;
  generic: number;
}

/**
 * Base card definition interface with strict typing
 */
export interface BaseCardDefinition {
  name: string;
  type: CardType;
  rarity: CardRarity;
  colors: CardColor[];
  description: string;
  manaCost: ManaCostDefinition;
}

/**
 * Creature-specific card definition
 */
export interface CreatureCardDefinition extends BaseCardDefinition {
  type: 'creature';
  power: number;
  toughness: number;
  abilities?: CardAbility[];
}

/**
 * Spell-specific card definition
 */
export interface SpellCardDefinition extends BaseCardDefinition {
  type: 'spell';
  effect: {
    type: string;
    target: string;
    value?: number;
    [key: string]: unknown;
  };
}

/**
 * Enchantment-specific card definition
 */
export interface EnchantmentCardDefinition extends BaseCardDefinition {
  type: 'enchantment';
  abilities: CardAbility[];
}

/**
 * Artifact-specific card definition
 */
export interface ArtifactCardDefinition extends BaseCardDefinition {
  type: 'artifact';
  abilities: CardAbility[];
  equipEffect?: {
    power?: number;
    toughness?: number;
  };
}

/**
 * Union type for all card definitions
 */
export type TypedCardDefinition =
  | CreatureCardDefinition
  | SpellCardDefinition
  | EnchantmentCardDefinition
  | ArtifactCardDefinition;

/**
 * Type-safe card definition builder
 * Provides compile-time validation and type inference
 */
export const defineCard = <T extends TypedCardDefinition>(card: T) => {
  // Validate mana cost consistency
  validateManaCost(card.manaCost);
  
  // Validate creature-specific properties
  if (card.type === 'creature') {
    validateCreatureStats(card.power, card.toughness);
  }
  
  // Validate spell-specific properties
  if (card.type === 'spell') {
    validateSpellEffect(card.effect);
  }
  
  return card;
};

/**
 * Validate mana cost structure
 */
function validateManaCost(manaCost: ManaCostDefinition): void {
  const manaTypes = ['red', 'blue', 'green', 'white', 'black', 'generic'] as const;
  
  for (const manaType of manaTypes) {
    const value = manaCost[manaType];
    if (value !== undefined && (value < 0 || !Number.isInteger(value))) {
      throw new Error(`Invalid mana cost for ${manaType}: ${value}. Must be a non-negative integer.`);
    }
  }
  
  // Ensure generic mana is defined
  if (manaCost.generic === undefined) {
    throw new Error('Generic mana cost must be defined');
  }
}

/**
 * Validate creature stats
 */
function validateCreatureStats(power: number, toughness: number): void {
  if (power < 0 || !Number.isInteger(power)) {
    throw new Error(`Invalid power: ${power}. Must be a non-negative integer.`);
  }
  
  if (toughness < 0 || !Number.isInteger(toughness)) {
    throw new Error(`Invalid toughness: ${toughness}. Must be a non-negative integer.`);
  }
}

/**
 * Validate spell effect structure
 */
function validateSpellEffect(effect: SpellCardDefinition['effect']): void {
  if (!effect.type) {
    throw new Error('Spell effect must have a type');
  }
  
  if (!effect.target) {
    throw new Error('Spell effect must have a target');
  }
}

/**
 * Type guard to check if a card definition is a creature
 */
export function isCreatureCard(card: TypedCardDefinition): card is CreatureCardDefinition {
  return card.type === 'creature';
}

/**
 * Type guard to check if a card definition is a spell
 */
export function isSpellCard(card: TypedCardDefinition): card is SpellCardDefinition {
  return card.type === 'spell';
}

/**
 * Type guard to check if a card definition is an enchantment
 */
export function isEnchantmentCard(card: TypedCardDefinition): card is EnchantmentCardDefinition {
  return card.type === 'enchantment';
}

/**
 * Type guard to check if a card definition is an artifact
 */
export function isArtifactCard(card: TypedCardDefinition): card is ArtifactCardDefinition {
  return card.type === 'artifact';
}
