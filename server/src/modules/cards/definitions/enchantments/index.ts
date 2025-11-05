import { defineCard } from '../../factory/card-definition-builder';
import { burningCycle, tidalProtection, windsFavorStatic, costReduction } from '../../abilities';

/**
 * Enchantment cards
 */

export const eternalFlame = defineCard({
  name: "Eternal Flame",
  rarity: "rare",
  colors: ["red"],
  description: "At the start of your turn, deal 1 damage to each player",
  manaCost: { red: 2, generic: 1 },
  type: "enchantment",
  abilities: [burningCycle]
});

export const oceansBlessing = defineCard({
  name: "Ocean's Blessing",
  rarity: "rare",
  colors: ["blue"],
  description: "Your creatures get +0/+1",
  manaCost: { blue: 2, generic: 1 },
  type: "enchantment",
  abilities: [tidalProtection]
});

export const windsGuidance = defineCard({
  name: "Wind's Guidance",
  rarity: "rare",
  colors: ["blue"],
  description: "Draw an additional card each turn",
  manaCost: { blue: 2, generic: 1 },
  type: "enchantment",
  abilities: [windsFavorStatic]
});

export const elementalNexus = defineCard({
  name: "Elemental Nexus",
  rarity: "mythic",
  colors: ["blue"],
  description: "Your spells cost 1 less to cast",
  manaCost: { blue: 2, generic: 2 },
  type: "enchantment",
  abilities: [costReduction]
});
