import { defineCard } from '../../factory/card-definition-builder';
import { fireballEffect, infernoEffect, flameShieldEffect, elementalFusionEffect } from '../../abilities';

export const fireball = defineCard({
  name: "Fireball",
  rarity: "common",
  colors: ["red"],
  description: fireballEffect.description,
  manaCost: { red: 1, generic: 2 },
  type: "spell",
  effect: fireballEffect.effect
});

export const inferno = defineCard({
  name: "Inferno",
  rarity: "mythic",
  colors: ["red"],
  description: infernoEffect.description,
  manaCost: { red: 3, generic: 2 },
  type: "spell",
  effect: infernoEffect.effect
});

export const flameShield = defineCard({
  name: "Flame Shield",
  rarity: "uncommon",
  colors: ["red"],
  description: flameShieldEffect.description,
  manaCost: { red: 1, generic: 1 },
  type: "spell",
  effect: flameShieldEffect.effect
});

export const elementalFusion = defineCard({
  name: "Elemental Fusion",
  rarity: "mythic",
  colors: ["red"],
  description: elementalFusionEffect.description,
  manaCost: { red: 2, generic: 2 },
  type: "spell",
  effect: elementalFusionEffect.effect
});
