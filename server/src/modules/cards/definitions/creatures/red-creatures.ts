import { defineCard } from '../../factory/card-definition-builder';
import { quickStrike, burningPresence, growth, rebirth, elementalMastery } from '../../abilities';

export const flameImp = defineCard({
  name: "Flame Imp",
  rarity: "common",
  colors: ["red"],
  type: "creature",
  description: "A small but aggressive imp that deals 2 damage when played",
  manaCost: { red: 1, generic: 0 },
  power: 2,
  toughness: 1,
  abilities: [quickStrike]
});

export const fireElemental = defineCard({
  name: "Fire Elemental",
  rarity: "uncommon",
  colors: ["red"],
  type: "creature",
  description: "A powerful elemental that deals 1 damage to all enemies when played",
  manaCost: { red: 2, generic: 1 },
  power: 3,
  toughness: 3,
  abilities: [burningPresence]
});

export const dragonHatchling = defineCard({
  name: "Dragon Hatchling",
  rarity: "rare",
  colors: ["red"],
  type: "creature",
  description: "Grows stronger each turn, gaining +1/+1",
  manaCost: { red: 1, generic: 1 },
  power: 1,
  toughness: 1,
  abilities: [growth]
});

export const firestormPhoenix = defineCard({
  name: "Firestorm Phoenix",
  rarity: "mythic",
  colors: ["red"],
  type: "creature",
  description: "When this creature dies, return it to your hand",
  manaCost: { red: 2, generic: 2 },
  power: 4,
  toughness: 3,
  abilities: [rebirth]
});

export const masterOfElements = defineCard({
  name: "Master of Elements",
  rarity: "mythic",
  colors: ["blue"],
  type: "creature",
  description: "Can use abilities from any color",
  manaCost: { blue: 3, generic: 2 },
  power: 5,
  toughness: 5,
  abilities: [elementalMastery]
});
