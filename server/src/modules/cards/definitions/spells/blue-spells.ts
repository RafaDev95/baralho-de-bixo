import { defineCard } from '../../factory/card-definition-builder';
import { tidalWaveEffect, tsunamiEffect, waterShieldEffect, gustEffect, cycloneEffect, windWalkSpellEffect } from '../../abilities';

export const tidalWave = defineCard({
  name: "Tidal Wave",
  rarity: "common",
  colors: ["blue"],
  description: tidalWaveEffect.description,
  manaCost: { blue: 1, generic: 1 },
  type: "spell",
  effect: tidalWaveEffect.effect
});

export const tsunami = defineCard({
  name: "Tsunami",
  rarity: "rare",
  colors: ["blue"],
  description: tsunamiEffect.description,
  manaCost: { blue: 2, generic: 2 },
  type: "spell",
  effect: tsunamiEffect.effect
});

export const waterShield = defineCard({
  name: "Water Shield",
  rarity: "uncommon",
  colors: ["blue"],
  description: waterShieldEffect.description,
  manaCost: { blue: 1, generic: 1 },
  type: "spell",
  effect: waterShieldEffect.effect
});

export const gust = defineCard({
  name: "Gust",
  rarity: "common",
  colors: ["blue"],
  description: gustEffect.description,
  manaCost: { blue: 1, generic: 1 },
  type: "spell",
  effect: gustEffect.effect
});

export const cyclone = defineCard({
  name: "Cyclone",
  rarity: "rare",
  colors: ["blue"],
  description: cycloneEffect.description,
  manaCost: { blue: 2, generic: 2 },
  type: "spell",
  effect: cycloneEffect.effect
});

export const windWalk = defineCard({
  name: "Wind Walk",
  rarity: "uncommon",
  colors: ["blue"],
  description: windWalkSpellEffect.description,
  manaCost: { blue: 1, generic: 1 },
  type: "spell",
  effect: windWalkSpellEffect.effect
});
