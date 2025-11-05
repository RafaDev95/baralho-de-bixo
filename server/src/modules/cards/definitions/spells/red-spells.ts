import { defineCard } from '../../factory/card-definition-builder';
import { fireballEffect, infernoEffect, flameShieldEffect, elementalFusionEffect } from '../../abilities';

/**
 * Red spell cards
 */

export const fireball = defineCard({
  name: "Fireball",
  rarity: "common",
  colors: ["red"],
  description: "Deal 3 damage to target creature or player",
  manaCost: { red: 1, generic: 2 },
  type: "spell",
  effect: {
    type: "damage",
    target: "any",
    value: 3
  }
});

export const inferno = defineCard({
  name: "Inferno",
  rarity: "mythic",
  colors: ["red"],
  description: "Deal 5 damage to all creatures and players",
  manaCost: { red: 3, generic: 2 },
  type: "spell",
  effect: {
    type: "damage",
    target: "all",
    value: 5
  }
});

export const flameShield = defineCard({
  name: "Flame Shield",
  rarity: "uncommon",
  colors: ["red"],
  description: "Give a creature +2/+0 and 'Deal 1 damage to attacker when blocked'",
  manaCost: { red: 1, generic: 1 },
  type: "spell",
  effect: {
    type: "modify_creature",
    target: "creature",
    power: 2,
    toughness: 0,
    abilities: [{
      name: "Counter Strike",
      description: "Deal 1 damage to attacker when blocked",
      trigger: "on_blocked",
      effect: {
        type: "damage",
        target: "attacker",
        value: 1
      }
    }]
  }
});

export const elementalFusion = defineCard({
  name: "Elemental Fusion",
  rarity: "mythic",
  colors: ["red"],
  description: "Combine two creatures into one with combined power and toughness",
  manaCost: { red: 2, generic: 2 },
  type: "spell",
  effect: {
    type: "fuse_creatures",
    target: "two_creatures"
  }
});
