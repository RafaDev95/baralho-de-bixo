import type { CardRarity, CardType } from '@/db/schemas';

// Enhanced ability trigger types based on JSON definitions
export type AbilityTrigger =
  | 'on_enter_battlefield'
  | 'on_turn_start'
  | 'on_attack'
  | 'on_block'
  | 'on_blocked'
  | 'on_targeted'
  | 'on_death'
  | 'static';

// Enhanced effect types based on JSON definitions
export type EffectType =
  | 'damage'
  | 'heal'
  | 'draw_cards'
  | 'discard'
  | 'summon'
  | 'block'
  | 'attack'
  | 'modify_stats'
  | 'return_to_hand'
  | 'return_to_library'
  | 'shuffle_into_library'
  | 'prevent_damage'
  | 'unblockable'
  | 'block_restriction'
  | 'additional_block'
  | 'additional_attack'
  | 'spell_immunity'
  | 'haste'
  | 'color_versatility'
  | 'reduce_cost'
  | 'fuse_creatures';

export type EffectTarget =
  | 'self'
  | 'player'
  | 'creature'
  | 'any'
  | 'all'
  | 'all_players'
  | 'all_creatures'
  | 'all_enemy_creatures'
  | 'your_creatures'
  | 'attacker'
  | 'two_creatures'
  | 'your_spells'
  | 'random';

export type EffectCondition =
  | 'if'
  | 'unless'
  | 'power_greater_than_2'
  | 'power_less_than_3'
  | 'power_greater_than_3';
export type EffectDuration =
  | 'instant'
  | 'permanent'
  | 'turn'
  | 'round'
  | 'until_end_of_turn';

export interface CardBase {
  name: string;
  type: CardType;
  rarity: CardRarity;
  description: string;
  energyCost: number; // Simplified: single energy cost (0-10)
}

export interface CreatureCard extends CardBase {
  type: 'creature';
  power: number;
  toughness: number;
  abilities?: CardAbility[];
  canAttack: boolean;
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

// Removed ManaCost - using simple energyCost number instead

export interface CardEffect {
  type: EffectType;
  target: EffectTarget;
  value?: number;
  condition?: EffectCondition;
  duration?: EffectDuration;
  power?: number;
  toughness?: number;
  abilities?: CardAbility[];
  position?: 'top' | 'bottom';
  [key: string]: unknown; // Allow additional properties for flexibility
}

export interface CardAbility {
  id: string;
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
  type: CardType;
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
