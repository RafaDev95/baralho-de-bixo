import { defineAbility } from '../ability-registry';
import type { AbilityDefinition } from '../ability-registry';

export const quickStrike: AbilityDefinition = defineAbility({
  id: 'quick_strike',
  name: 'Quick Strike',
  description: 'When played, deal 2 damage to target player',
  trigger: 'on_enter_battlefield',
  effect: {
    type: 'damage',
    target: 'player',
    value: 2
  }
});

export const burningPresence: AbilityDefinition = defineAbility({
  id: 'burning_presence',
  name: 'Burning Presence',
  description: 'When played, deal 1 damage to all enemy creatures',
  trigger: 'on_enter_battlefield',
  effect: {
    type: 'damage',
    target: 'all_enemy_creatures',
    value: 1
  }
});

export const growth: AbilityDefinition = defineAbility({
  id: 'growth',
  name: 'Growth',
  description: 'At the beginning of your turn, this creature gets +1/+1',
  trigger: 'on_turn_start',
  effect: {
    type: 'modify_stats',
    target: 'self',
    power: 1,
    toughness: 1
  }
});

export const evasive: AbilityDefinition = defineAbility({
  id: 'evasive',
  name: 'Evasive',
  description: 'When targeted by a spell or ability, return this creature to your hand',
  trigger: 'on_targeted',
  effect: {
    type: 'return_to_hand',
    target: 'self'
  }
});

export const multipleBlock: AbilityDefinition = defineAbility({
  id: 'multiple_block',
  name: 'Multiple Block',
  description: 'This creature can block an additional creature each turn',
  trigger: 'on_block',
  effect: {
    type: 'additional_block',
    target: 'self'
  }
});

export const intimidatingPresence: AbilityDefinition = defineAbility({
  id: 'intimidating_presence',
  name: 'Intimidating Presence',
  description: 'This creature can\'t be blocked by creatures with power 2 or less',
  trigger: 'on_block',
  effect: {
    type: 'block_restriction',
    target: 'self',
    condition: 'power_greater_than_2'
  }
});

export const elusive: AbilityDefinition = defineAbility({
  id: 'elusive',
  name: 'Elusive',
  description: 'This creature can\'t be blocked by creatures with power 3 or greater',
  trigger: 'on_block',
  effect: {
    type: 'block_restriction',
    target: 'self',
    condition: 'power_less_than_3'
  }
});

export const windsFavor: AbilityDefinition = defineAbility({
  id: 'winds_favor',
  name: 'Wind\'s Favor',
  description: 'When played, draw a card',
  trigger: 'on_enter_battlefield',
  effect: {
    type: 'draw_cards',
    target: 'self',
    value: 1
  }
});

export const doubleStrike: AbilityDefinition = defineAbility({
  id: 'double_strike',
  name: 'Double Strike',
  description: 'This creature can attack twice each turn',
  trigger: 'on_attack',
  effect: {
    type: 'additional_attack',
    target: 'self'
  }
});

export const rebirth: AbilityDefinition = defineAbility({
  id: 'rebirth',
  name: 'Rebirth',
  description: 'When this creature dies, return it to your hand',
  trigger: 'on_death',
  effect: {
    type: 'return_to_hand',
    target: 'self'
  }
});

export const tidalForce: AbilityDefinition = defineAbility({
  id: 'tidal_force',
  name: 'Tidal Force',
  description: 'This creature can\'t be blocked by creatures with power less than 3',
  trigger: 'on_block',
  effect: {
    type: 'block_restriction',
    target: 'self',
    condition: 'power_greater_than_3'
  }
});

export const haste: AbilityDefinition = defineAbility({
  id: 'haste',
  name: 'Haste',
  description: 'This creature can attack the turn it comes into play',
  trigger: 'static',
  effect: {
    type: 'haste',
    target: 'self'
  }
});

export const elementalMastery: AbilityDefinition = defineAbility({
  id: 'elemental_mastery',
  name: 'Elemental Mastery',
  description: 'This creature can use abilities from any color',
  trigger: 'static',
  effect: {
    type: 'color_versatility',
    target: 'self'
  }
});

export const burningCycle: AbilityDefinition = defineAbility({
  id: 'burning_cycle',
  name: 'Burning Cycle',
  description: 'At the start of your turn, deal 1 damage to each player',
  trigger: 'on_turn_start',
  effect: {
    type: 'damage',
    target: 'all_players',
    value: 1
  }
});

export const tidalProtection: AbilityDefinition = defineAbility({
  id: 'tidal_protection',
  name: 'Tidal Protection',
  description: 'Your creatures get +0/+1',
  trigger: 'static',
  effect: {
    type: 'modify_stats',
    target: 'your_creatures',
    toughness: 1
  }
});

export const windsFavorStatic: AbilityDefinition = defineAbility({
  id: 'winds_favor_static',
  name: 'Wind\'s Favor',
  description: 'Draw an additional card each turn',
  trigger: 'on_turn_start',
  effect: {
    type: 'draw_cards',
    target: 'self',
    value: 1
  }
});

export const flameStrike: AbilityDefinition = defineAbility({
  id: 'flame_strike',
  name: 'Flame Strike',
  description: 'When equipped creature attacks, deal 1 damage to target creature',
  trigger: 'on_attack',
  effect: {
    type: 'damage',
    target: 'creature',
    value: 1
  }
});

export const spellWard: AbilityDefinition = defineAbility({
  id: 'spell_ward',
  name: 'Spell Ward',
  description: 'Equipped creature can\'t be targeted by spells',
  trigger: 'static',
  effect: {
    type: 'spell_immunity',
    target: 'self'
  }
});

export const windWalk: AbilityDefinition = defineAbility({
  id: 'wind_walk',
  name: 'Wind Walk',
  description: 'Equipped creature can\'t be blocked',
  trigger: 'static',
  effect: {
    type: 'unblockable',
    target: 'self'
  }
});

export const counterStrike: AbilityDefinition = defineAbility({
  id: 'counter_strike',
  name: 'Counter Strike',
  description: 'Deal 1 damage to attacker when blocked',
  trigger: 'on_blocked',
  effect: {
    type: 'damage',
    target: 'attacker',
    value: 1
  }
});

export const costReduction: AbilityDefinition = defineAbility({
  id: 'cost_reduction',
  name: 'Cost Reduction',
  description: 'Your spells cost 1 less to cast',
  trigger: 'static',
  effect: {
    type: 'reduce_cost',
    target: 'your_spells',
    value: 1
  }
});

/**
 * Export all combat abilities
 */
export const combatAbilities = {
  quickStrike,
  burningPresence,
  growth,
  evasive,
  multipleBlock,
  intimidatingPresence,
  elusive,
  windsFavor,
  doubleStrike,
  rebirth,
  tidalForce,
  haste,
  elementalMastery,
  burningCycle,
  tidalProtection,
  windsFavorStatic,
  flameStrike,
  spellWard,
  windWalk,
  counterStrike,
  costReduction,
} as const;
