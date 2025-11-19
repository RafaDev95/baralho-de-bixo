import { defineCard } from '@/modules/cards/factory/card-definition-builder';
import { evasive, multipleBlock, intimidatingPresence, tidalForce, windsFavor, doubleStrike, haste } from '@/modules/cards/abilities';

export const waterSprite = defineCard({
  name: "Water Sprite",
  rarity: "common",
  colors: ["blue"],
  type: "creature",
  description: "Can return to hand when targeted",
  manaCost: { blue: 1, generic: 0 },
  power: 1,
  toughness: 2,
  abilities: [evasive]
});

export const tidalGuardian = defineCard({
  name: "Tidal Guardian",
  rarity: "uncommon",
  colors: ["blue"],
  type: "creature",
  description: "Can block an additional creature each turn",
  manaCost: { blue: 2, generic: 1 },
  power: 2,
  toughness: 4,
  abilities: [multipleBlock]
});

export const leviathan = defineCard({
  name: "Leviathan",
  rarity: "mythic",
  colors: ["blue"],
  type: "creature",
  description: "Can't be blocked by creatures with power 2 or less",
  manaCost: { blue: 3, generic: 2 },
  power: 5,
  toughness: 5,
  abilities: [intimidatingPresence]
});

export const windSprite = defineCard({
  name: "Wind Sprite",
  rarity: "common",
  colors: ["blue"],
  type: "creature",
  description: "Can't be blocked by creatures with power 3 or greater",
  manaCost: { blue: 1, generic: 0 },
  power: 1,
  toughness: 1,
  abilities: [intimidatingPresence]
});

export const stormCaller = defineCard({
  name: "Storm Caller",
  rarity: "uncommon",
  colors: ["blue"],
  type: "creature",
  description: "When played, draw a card",
  manaCost: { blue: 1, generic: 1 },
  power: 2,
  toughness: 2,
  abilities: [windsFavor]
});

export const thunderBird = defineCard({
  name: "Thunder Bird",
  rarity: "rare",
  colors: ["blue"],
  type: "creature",
  description: "Can attack twice each turn",
  manaCost: { blue: 2, generic: 1 },
  power: 3,
  toughness: 2,
  abilities: [doubleStrike]
});

export const tidalDragon = defineCard({
  name: "Tidal Dragon",
  rarity: "mythic",
  colors: ["blue"],
  type: "creature",
  description: "Can't be blocked by creatures with power less than 3",
  manaCost: { blue: 3, generic: 1 },
  power: 4,
  toughness: 4,
  abilities: [tidalForce]
});

export const stormElemental = defineCard({
  name: "Storm Elemental",
  rarity: "mythic",
  colors: ["blue"],
  type: "creature",
  description: "Can attack the turn it comes into play",
  manaCost: { blue: 2, generic: 2 },
  power: 3,
  toughness: 3,
  abilities: [haste]
});
