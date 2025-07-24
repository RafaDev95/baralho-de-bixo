import { pgEnum } from 'drizzle-orm/pg-core';

export const colorEnum = pgEnum('color', [
  'white',
  'blue',
  'black',
  'red',
  'green',
  'colorless',
]);
export const typeEnum = pgEnum('type', [
  'creature',
  'spell',
  'enchantment',
  'artifact',
]);
export const rarityEnum = pgEnum('rarity', [
  'common',
  'uncommon',
  'rare',
  'mythic',
]);
export const cardZoneEnum = pgEnum('card_zone', [
  'library',
  'hand',
  'battlefield',
  'graveyard',
  'exile',
  'stack',
]);
