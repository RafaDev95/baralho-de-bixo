import { defineAbility } from '../ability-registry';
import type { AbilityDefinition } from '../ability-registry';

export const fireballEffect: AbilityDefinition = defineAbility({
  id: 'fireball_effect',
  name: 'Fireball',
  description: 'Deal 3 damage to target creature or player',
  trigger: 'static',
  effect: {
    type: 'damage',
    target: 'any',
    value: 3,
  },
});

export const infernoEffect: AbilityDefinition = defineAbility({
  id: 'inferno_effect',
  name: 'Inferno',
  description: 'Deal 5 damage to all creatures and players',
  trigger: 'static',
  effect: {
    type: 'damage',
    target: 'all',
    value: 5,
  },
});

export const flameShieldEffect: AbilityDefinition = defineAbility({
  id: 'flame_shield_effect',
  name: 'Flame Shield',
  description:
    "Give a creature +2/+0 and 'Deal 1 damage to attacker when blocked'",
  trigger: 'static',
  effect: {
    type: 'modify_stats',
    target: 'creature',
    power: 2,
    toughness: 0,
  },
});

export const tidalWaveEffect: AbilityDefinition = defineAbility({
  id: 'tidal_wave_effect',
  name: 'Tidal Wave',
  description: "Return target creature to its owner's hand",
  trigger: 'static',
  effect: {
    type: 'return_to_hand',
    target: 'creature',
  },
});

export const tsunamiEffect: AbilityDefinition = defineAbility({
  id: 'tsunami_effect',
  name: 'Tsunami',
  description: "Return all creatures to their owners' hands",
  trigger: 'static',
  effect: {
    type: 'return_to_hand',
    target: 'all_creatures',
  },
});

export const waterShieldEffect: AbilityDefinition = defineAbility({
  id: 'water_shield_effect',
  name: 'Water Shield',
  description: 'Prevent all damage to target creature this turn',
  trigger: 'static',
  effect: {
    type: 'prevent_damage',
    target: 'creature',
    duration: 'until_end_of_turn',
  },
});

export const gustEffect: AbilityDefinition = defineAbility({
  id: 'gust_effect',
  name: 'Gust',
  description: "Return target creature to the top of its owner's library",
  trigger: 'static',
  effect: {
    type: 'return_to_library',
    target: 'creature',
    position: 'top',
  },
});

export const cycloneEffect: AbilityDefinition = defineAbility({
  id: 'cyclone_effect',
  name: 'Cyclone',
  description: "Shuffle all creatures into their owners' libraries",
  trigger: 'static',
  effect: {
    type: 'shuffle_into_library',
    target: 'all_creatures',
  },
});

export const windWalkSpellEffect: AbilityDefinition = defineAbility({
  id: 'wind_walk_spell_effect',
  name: 'Wind Walk',
  description: "Target creature can't be blocked this turn",
  trigger: 'static',
  effect: {
    type: 'unblockable',
    target: 'creature',
    duration: 'until_end_of_turn',
  },
});

export const elementalFusionEffect: AbilityDefinition = defineAbility({
  id: 'elemental_fusion_effect',
  name: 'Elemental Fusion',
  description:
    'Combine two creatures into one with combined power and toughness',
  trigger: 'static',
  effect: {
    type: 'fuse_creatures',
    target: 'two_creatures',
  },
});

export const spellEffects = {
  fireballEffect,
  infernoEffect,
  flameShieldEffect,
  tidalWaveEffect,
  tsunamiEffect,
  waterShieldEffect,
  gustEffect,
  cycloneEffect,
  windWalkSpellEffect,
  elementalFusionEffect,
} as const;
