import { defineCard } from '../../factory/card-definition-builder';
import { flameStrike, spellWard, windWalk } from '@/modules/cards/abilities';

export const flameSword = defineCard({
  name: "Flame Sword",
  rarity: "uncommon",
  description: "Equipped creature gets +2/+0 and deals 1 damage to target creature when it attacks",
  energyCost: 2,
  type: "artifact",
  abilities: [flameStrike],
  equipEffect: {
    power: 2,
    toughness: 0
  }
});

export const waterAmulet = defineCard({
  name: "Water Amulet",
  rarity: "uncommon",
  description: "Equipped creature gets +0/+2 and can't be targeted by spells",
  energyCost: 2,
  type: "artifact",
  abilities: [spellWard],
  equipEffect: {
    power: 0,
    toughness: 2
  }
});

export const windBoots = defineCard({
  name: "Wind Boots",
  rarity: "uncommon",
  description: "Equipped creature can't be blocked",
  energyCost: 2,
  type: "artifact",
  abilities: [windWalk]
});
