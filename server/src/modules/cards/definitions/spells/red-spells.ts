import { defineCard } from '../../factory/card-definition-builder';
import { fireballEffect, infernoEffect, flameShieldEffect, elementalFusionEffect } from '../../abilities';

export const fireball = defineCard({
  name: "Fireball",
  rarity: "common",
  description: fireballEffect.description,
  energyCost: 3,
  type: "spell",
  effect: fireballEffect.effect
});

export const inferno = defineCard({
  name: "Inferno",
  rarity: "mythic",
  description: infernoEffect.description,
  energyCost: 5,
  type: "spell",
  effect: infernoEffect.effect
});

export const flameShield = defineCard({
  name: "Flame Shield",
  rarity: "uncommon",
  description: flameShieldEffect.description,
  energyCost: 2,
  type: "spell",
  effect: flameShieldEffect.effect
});

export const elementalFusion = defineCard({
  name: "Elemental Fusion",
  rarity: "mythic",
  description: elementalFusionEffect.description,
  energyCost: 4,
  type: "spell",
  effect: elementalFusionEffect.effect
});
