import type { CardType } from '@/db/schemas/cards';
import {
  ArtifactCardFactory,
  CreatureCardFactory,
  EnchantmentCardFactory,
  SpellCardFactory,
} from './strategies';
import type { CardDefinition, CardEffect, CardFactoryStrategy } from './types';

export const DEFAULT_EFFECT: CardEffect = {
  type: 'damage',
  target: 'creature',
  value: 1,
};

export const BASE_CARD_REQUIRED_FIELDS: (keyof CardDefinition)[] = [
  'name',
  'type',
  'rarity',
  'energyCost',
];

export const CARD_TYPE_DEFINITIONS: Record<CardType, CardFactoryStrategy> = {
  creature: new CreatureCardFactory(),
  spell: new SpellCardFactory(),
  enchantment: new EnchantmentCardFactory(),
  artifact: new ArtifactCardFactory(),
};
