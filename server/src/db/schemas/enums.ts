import { pgEnum } from 'drizzle-orm/pg-core';

export const attributeEnum = pgEnum('attribute', ['fire', 'water', 'wind']);
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
  'epic',
]);
export const cardZoneEnum = pgEnum('card_zone', [
  'library',
  'hand',
  'battlefield',
  'graveyard',
  'exile',
  'stack',
]);
