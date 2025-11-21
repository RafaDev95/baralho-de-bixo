import { defineCard } from '../../factory/card-definition-builder';
import { tidalWaveEffect, tsunamiEffect, waterShieldEffect, gustEffect, cycloneEffect, windWalkSpellEffect } from '../../abilities';

export const tidalWave = defineCard({
  name: "Tidal Wave",
  rarity: "common",
  description: tidalWaveEffect.description,
  energyCost: 2,
  type: "spell",
  effect: tidalWaveEffect.effect
});

export const tsunami = defineCard({
  name: "Tsunami",
  rarity: "rare",
  description: tsunamiEffect.description,
  energyCost: 4,
  type: "spell",
  effect: tsunamiEffect.effect
});

export const waterShield = defineCard({
  name: "Water Shield",
  rarity: "uncommon",
  description: waterShieldEffect.description,
  energyCost: 2,
  type: "spell",
  effect: waterShieldEffect.effect
});

export const gust = defineCard({
  name: "Gust",
  rarity: "common",
  description: gustEffect.description,
  energyCost: 2,
  type: "spell",
  effect: gustEffect.effect
});

export const cyclone = defineCard({
  name: "Cyclone",
  rarity: "rare",
  description: cycloneEffect.description,
  energyCost: 4,
  type: "spell",
  effect: cycloneEffect.effect
});

export const windWalk = defineCard({
  name: "Wind Walk",
  rarity: "uncommon",
  description: windWalkSpellEffect.description,
  energyCost: 2,
  type: "spell",
  effect: windWalkSpellEffect.effect
});
