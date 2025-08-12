import type { CardRarity, CardType } from '@/db/schemas';

export type EffectTarget = 'self' | 'enemy' | 'all' | 'random';
export type EffectCondition = 'if' | 'unless';
export type EffectDuration = 'instant' | 'permanent' | 'turn' | 'round';
export type AbilityTrigger =
  | 'onSummon'
  | 'onAttack'
  | 'onBlock'
  | 'onDamage'
  | 'onHeal'
  | 'onDraw'
  | 'onDiscard';

export type EffectType =
  | 'damage'
  | 'heal'
  | 'draw'
  | 'discard'
  | 'summon'
  | 'block'
  | 'attack';

export interface CardBase {
  name: string;
  type: CardType;
  rarity: CardRarity;
  colors: string[];
  description: string;
  manaCost: ManaCost;
}

export interface CreatureCard extends CardBase {
  type: 'creature';
  power: number;
  toughness: number;
  abilities?: CardAbility[];
  canAttack: boolean;
  canBlock: boolean;
  hasSummoningSickness: boolean;
}

export interface SpellCard extends CardBase {
  type: 'spell';
  effect: CardEffect;
}

export interface EnchantmentCard extends CardBase {
  type: 'enchantment';
  abilities: CardAbility[];
}

export interface ArtifactCard extends CardBase {
  type: 'artifact';
  abilities: CardAbility[];
}

export interface ManaCost {
  fire?: number;
  water?: number;
  wind?: number;
  generic: number;
}

export interface CardEffect {
  type: EffectType;
  target: EffectTarget;
  value: number;
  condition?: EffectCondition;
}

export interface CardAbility {
  name: string;
  description: string;
  trigger: AbilityTrigger;
  effect: CardEffect;
}

export interface CardDefinition extends CardBase {
  power?: number;
  toughness?: number;
  abilities?: CardAbility[];
  effect?: CardEffect;
}

export type CardFactoryData =
  | Omit<CardBase, 'type'>
  | Omit<CreatureCard, 'type'>
  | Omit<SpellCard, 'type'>
  | Omit<EnchantmentCard, 'type'>
  | Omit<ArtifactCard, 'type'>;

export interface CardFactoryStrategy {
  createCard(cardData: CardDefinition): CardDefinition;
}
