import type { CardAttribute } from '@/db/schemas';

export interface StarterDeckDefinition {
  name: string;
  attribute: CardAttribute;
  description: string;
  cardCounts: {
    [cardName: string]: number;
  };
}

export const MONO_RED_DECK: StarterDeckDefinition = {
  name: 'Mono Red Aggro',
  attribute: 'fire',
  description:
    'An aggressive deck focused on dealing quick damage with fire creatures and spells',
  cardCounts: {
    'Flame Imp': 4,
    'Fire Elemental': 3,
    'Dragon Hatchling': 3,
    Fireball: 4,
    Inferno: 2,
    'Flame Shield': 3,
    'Firestorm Phoenix': 2,
    'Eternal Flame': 2,
    'Flame Sword': 2,
    'Elemental Fusion': 1,
  },
};

export const MONO_GREEN_DECK: StarterDeckDefinition = {
  name: 'Mono Green Control',
  attribute: 'water',
  description:
    'A control deck that focuses on managing the board with water creatures and spells',
  cardCounts: {
    'Water Sprite': 4,
    'Tidal Guardian': 3,
    Leviathan: 2,
    'Tidal Wave': 4,
    Tsunami: 2,
    'Water Shield': 3,
    'Tidal Dragon': 2,
    "Ocean's Blessing": 2,
    'Water Amulet': 2,
    'Master of Elements': 1,
  },
};

export const STARTER_DECKS = [MONO_RED_DECK, MONO_GREEN_DECK];
