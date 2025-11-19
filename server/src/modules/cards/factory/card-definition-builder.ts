import type { CardType, CardRarity, CardColor } from '@/db/schemas';
import type { CardAbility } from './types';

export interface ManaCostDefinition {
  red?: number;
  blue?: number;
  green?: number;
  white?: number;
  black?: number;
  generic: number;
}

export interface BaseCardDefinition {
  name: string;
  type: CardType;
  rarity: CardRarity;
  colors: CardColor[];
  description: string;
  manaCost: ManaCostDefinition;
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
