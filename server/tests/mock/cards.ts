export const mockCreatureCardDefinition = {
  name: 'Flame Imp',
  rarity: 'common',
  description: 'A small but aggressive imp',
  energyCost: 1,
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
  description: 'Deal 3 damage',
  energyCost: 3,
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
  description: 'Gain 2 armor',
  energyCost: 3,
  type: 'enchantment',
  abilities: [
    {
      name: 'Fire Shield',
      description: 'Gain 2 armor when played',
      trigger: 'onSummon',
      effect: {
        type: 'heal',
        target: 'self',
        value: 2,
      },
    },
  ],
};

export const mockArtifactCardDefinition = {
  name: 'Fire Sword',
  rarity: 'common',
  description: 'Deal 2 damage',
  energyCost: 3,
  type: 'artifact',
  abilities: [
    {
      name: 'Fire Sword',
      description: 'Deal 2 damage when equipped',
      trigger: 'onSummon',
      effect: {
        type: 'damage',
        target: 'enemy',
        value: 2,
      },
    },
  ],
};

export const mockCardData = {
  cards: [
    mockCreatureCardDefinition,
    mockSpellCardDefinition,
    mockEnchantmentCardDefinition,
    mockArtifactCardDefinition,
  ],
};
