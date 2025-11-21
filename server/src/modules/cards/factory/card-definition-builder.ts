import type { CardType, CardRarity } from '@/db/schemas';
import type { CardAbility } from './types';

export interface BaseCardDefinition {
  name: string;
  type: CardType;
  rarity: CardRarity;
  description: string;
  energyCost: number; // Simple energy cost (0-10)
}


export interface CreatureCardDefinition extends BaseCardDefinition {
  type: 'creature';
  power: number;
  toughness: number;
  abilities?: CardAbility[];
}


export interface SpellCardDefinition extends BaseCardDefinition {
  type: 'spell';
  effect: {
    type: string;
    target: string;
    value?: number;
    [key: string]: unknown;
  };
}


export interface EnchantmentCardDefinition extends BaseCardDefinition {
  type: 'enchantment';
  abilities: CardAbility[];
}

export interface ArtifactCardDefinition extends BaseCardDefinition {
  type: 'artifact';
  abilities: CardAbility[];
  equipEffect?: {
    power?: number;
    toughness?: number;
  };
}

export type TypedCardDefinition =
  | CreatureCardDefinition
  | SpellCardDefinition
  | EnchantmentCardDefinition
  | ArtifactCardDefinition;

export const defineCard = <T extends TypedCardDefinition>(card: T) => {
  // Validate energy cost
  validateEnergyCost(card.energyCost);
  
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

function validateEnergyCost(energyCost: number): void {
  if (energyCost < 0 || energyCost > 10 || !Number.isInteger(energyCost)) {
    throw new Error(`Invalid energy cost: ${energyCost}. Must be an integer between 0 and 10.`);
  }
}

function validateCreatureStats(power: number, toughness: number): void {
  if (power < 0 || !Number.isInteger(power)) {
    throw new Error(`Invalid power: ${power}. Must be a non-negative integer.`);
  }
  
  if (toughness < 0 || !Number.isInteger(toughness)) {
    throw new Error(`Invalid toughness: ${toughness}. Must be a non-negative integer.`);
  }
}

function validateSpellEffect(effect: SpellCardDefinition['effect']): void {
  if (!effect.type) {
    throw new Error('Spell effect must have a type');
  }
  
  if (!effect.target) {
    throw new Error('Spell effect must have a target');
  }
}

export function isCreatureCard(card: TypedCardDefinition): card is CreatureCardDefinition {
  return card.type === 'creature';
}

export function isSpellCard(card: TypedCardDefinition): card is SpellCardDefinition {
  return card.type === 'spell';
}

export function isEnchantmentCard(card: TypedCardDefinition): card is EnchantmentCardDefinition {
  return card.type === 'enchantment';
}

export function isArtifactCard(card: TypedCardDefinition): card is ArtifactCardDefinition {
  return card.type === 'artifact';
}
