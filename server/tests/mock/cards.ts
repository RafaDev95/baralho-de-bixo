export const mockCreatureCardDefinition = {
  name: 'Flame Imp',
  rarity: 'common',
  colors: ['red'],
  description: 'A small but aggressive imp',
  manaCost: { fire: 1, generic: 0 },
  type: 'creature',
  power: 2,
  toughness: 1,
  abilities: [
    {
      name: 'Quick Strike',
      description: 'Deal 2 damage when played',
      trigger: 'onSummon',
      effect: {
        type: 'damage',
        target: 'enemy',
        value: 2,
      },
    },
  ],
};

export const mockSpellCardDefinition = {
  name: 'Fireball',
  rarity: 'common',
  colors: ['red'],
  description: 'Deal 3 damage',
  manaCost: { fire: 1, generic: 2 },
  type: 'spell',
  effect: {
    type: 'damage',
    target: 'enemy',
    value: 3,
  },
};

export const mockEnchantmentCardDefinition = {
  name: 'Fire Shield',
  rarity: 'common',
  colors: ['red'],
  description: 'Gain 2 armor',
  duration: 'permanent',
  manaCost: { fire: 1, generic: 2 },
  type: 'enchantment',
  effect: {
    type: 'armor',
    target: 'self',
    value: 2,
  },
};

export const mockArtifactCardDefinition = {
  name: 'Fire Sword',
  rarity: 'common',
  colors: ['red'],
  description: 'Deal 2 damage',
  manaCost: { fire: 1, generic: 2 },
  type: 'artifact',
  isEquipment: true,
  effect: {
    type: 'damage',
    target: 'enemy',
    value: 2,
  },
};

export const mockCardData = {
  cards: [
    mockCreatureCardDefinition,
    mockSpellCardDefinition,
    mockEnchantmentCardDefinition,
    mockArtifactCardDefinition,
  ],
};
