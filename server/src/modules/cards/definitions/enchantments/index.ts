import { defineCard } from '../../factory/card-definition-builder';
import { burningCycle, tidalProtection, windsFavorStatic, costReduction } from '../../abilities';

export const eternalFlame = defineCard({
  name: "Eternal Flame",
  rarity: "rare",
  description: "At the start of your turn, deal 1 damage to each player",
  energyCost: 3,
  type: "enchantment",
  abilities: [burningCycle]
});

export const oceansBlessing = defineCard({
  name: "Ocean's Blessing",
  rarity: "rare",
  description: "Your creatures get +0/+1",
  energyCost: 3,
  type: "enchantment",
  abilities: [tidalProtection]
});

export const windsGuidance = defineCard({
  name: "Wind's Guidance",
  rarity: "rare",
  description: "Draw an additional card each turn",
  energyCost: 3,
  type: "enchantment",
  abilities: [windsFavorStatic]
});

export const elementalNexus = defineCard({
  name: "Elemental Nexus",
  rarity: "mythic",
  description: "Your spells cost 1 less to cast",
  energyCost: 4,
  type: "enchantment",
  abilities: [costReduction]
});
