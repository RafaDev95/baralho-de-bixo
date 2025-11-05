import { defineCard } from '../../factory/card-definition-builder';
import { tidalWaveEffect, tsunamiEffect, waterShieldEffect, gustEffect, cycloneEffect, windWalkSpellEffect } from '../../abilities';

/**
 * Blue spell cards
 */

export const tidalWave = defineCard({
  name: "Tidal Wave",
  rarity: "common",
  colors: ["blue"],
  description: "Return target creature to its owner's hand",
  manaCost: { blue: 1, generic: 1 },
  type: "spell",
  effect: {
    type: "return_to_hand",
    target: "creature"
  }
});

export const tsunami = defineCard({
  name: "Tsunami",
  rarity: "rare",
  colors: ["blue"],
  description: "Return all creatures to their owners' hands",
  manaCost: { blue: 2, generic: 2 },
  type: "spell",
  effect: {
    type: "return_to_hand",
    target: "all_creatures"
  }
});

export const waterShield = defineCard({
  name: "Water Shield",
  rarity: "uncommon",
  colors: ["blue"],
  description: "Prevent all damage to target creature this turn",
  manaCost: { blue: 1, generic: 1 },
  type: "spell",
  effect: {
    type: "prevent_damage",
    target: "creature",
    duration: "until_end_of_turn"
  }
});

export const gust = defineCard({
  name: "Gust",
  rarity: "common",
  colors: ["blue"],
  description: "Return target creature to the top of its owner's library",
  manaCost: { blue: 1, generic: 1 },
  type: "spell",
  effect: {
    type: "return_to_library",
    target: "creature",
    position: "top"
  }
});

export const cyclone = defineCard({
  name: "Cyclone",
  rarity: "rare",
  colors: ["blue"],
  description: "Shuffle all creatures into their owners' libraries",
  manaCost: { blue: 2, generic: 2 },
  type: "spell",
  effect: {
    type: "shuffle_into_library",
    target: "all_creatures"
  }
});

export const windWalk = defineCard({
  name: "Wind Walk",
  rarity: "uncommon",
  colors: ["blue"],
  description: "Target creature can't be blocked this turn",
  manaCost: { blue: 1, generic: 1 },
  type: "spell",
  effect: {
    type: "unblockable",
    target: "creature",
    duration: "until_end_of_turn"
  }
});
