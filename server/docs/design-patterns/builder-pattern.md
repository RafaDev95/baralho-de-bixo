# Builder Pattern

## Overview

The Builder Pattern provides type-safe, validated construction of complex objects. This TCG uses builder functions (`defineCard`, `defineAbility`, `defineDeck`) that validate input at both compile-time (TypeScript) and runtime, making it impossible to create invalid game objects.

## Implementation

### 1. Card Builder

**Location**: `src/modules/cards/factory/card-definition-builder.ts`

```typescript
export const defineCard = <T extends TypedCardDefinition>(card: T) => {
  validateEnergyCost(card.energyCost);

  if (card.type === 'creature') {
    validateCreatureStats(card.power, card.toughness);
  }

  if (card.type === 'spell') {
    validateSpellEffect(card.effect);
  }

  return card;
};
```

**Type Definitions:**
```typescript
type TypedCardDefinition =
  | CreatureCardDefinition
  | SpellCardDefinition
  | EnchantmentCardDefinition
  | ArtifactCardDefinition;

interface CreatureCardDefinition extends BaseCardDefinition {
  type: 'creature';
  power: number;
  toughness: number;
  abilities?: CardAbility[];
}

interface SpellCardDefinition extends BaseCardDefinition {
  type: 'spell';
  effect: { type: string; target: string; value?: number; };
}
```

### 2. Ability Builder

**Location**: `src/modules/cards/abilities/ability-registry.ts`

```typescript
export const defineAbility = <T extends AbilityDefinition>(ability: T) => {
  validateAbility(ability);
  return ability;
};

interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  trigger: AbilityTrigger;
  effect: {
    type: EffectType;
    target: EffectTarget;
    value?: number;
  };
}
```

### 3. Deck Builder

**Location**: `src/modules/decks/deck-builder.ts`

```typescript
export const defineDeck = <T extends DeckTemplate>(deck: T) => {
  validateDeck(deck);
  return deck;
};

interface DeckTemplate {
  name: string;
  type: 'starter' | 'custom';
  description: string;
  cards: DeckCardEntry[];
}

interface DeckCardEntry {
  card: TypedCardDefinition;  // Direct reference, not string!
  count: number;
}
```

## Why This Pattern?

- **Compile-time safety** - TypeScript catches missing/wrong fields
- **Runtime validation** - Additional checks at object creation
- **IDE support** - Autocomplete, refactoring, go-to-definition
- **Impossible to reference non-existent cards** - Direct imports, not strings

## Benefits for This TCG

### 1. Compile-Time Error Detection
```typescript
// TypeScript error: Property 'power' is missing
const badCreature = defineCard({
  name: "Dragon",
  type: "creature",
  rarity: "rare",
  description: "A dragon",
  energyCost: 5,
  toughness: 5  // Missing power!
});

// TypeScript error: Type '"invalid"' is not assignable to type 'CardType'
const badType = defineCard({
  name: "Test",
  type: "invalid",  // Not a valid card type
  // ...
});
```

### 2. Runtime Validation
```typescript
// Throws at runtime: "Invalid energy cost: 15. Must be between 0 and 10."
const invalidCost = defineCard({
  name: "Test",
  type: "creature",
  rarity: "common",
  description: "Test",
  energyCost: 15,  // Invalid!
  power: 2,
  toughness: 2
});

// Throws: "Invalid power: -1. Must be a non-negative integer."
const negativePower = defineCard({
  name: "Test",
  type: "creature",
  energyCost: 1,
  power: -1,  // Invalid!
  toughness: 1
});
```

### 3. Type-Safe Card References in Decks
```typescript
import { flameImp, fireElemental, fireball } from '../../cards/definitions';

// Cards are actual objects, not strings
export const monoRedAggro = defineDeck({
  name: 'Mono Red Aggro',
  description: 'Aggressive fire deck',
  type: 'starter',
  cards: [
    { card: flameImp, count: 4 },      // IDE knows flameImp is a creature
    { card: fireElemental, count: 3 }, // Can ctrl+click to see definition
    { card: fireball, count: 4 },      // Renaming updates all references
  ]
});

// If you delete flameImp, TypeScript shows error here!
```

### 4. Reusable Abilities
```typescript
// Define once
export const quickStrike = defineAbility({
  id: 'quick_strike',
  name: 'Quick Strike',
  description: 'Deal 2 damage on enter',
  trigger: 'on_enter_battlefield',
  effect: { type: 'damage', target: 'player', value: 2 }
});

// Use in multiple cards
export const flameImp = defineCard({
  name: "Flame Imp",
  type: "creature",
  energyCost: 1,
  power: 2,
  toughness: 1,
  abilities: [quickStrike]  // Direct reference
});

export const fireSprite = defineCard({
  name: "Fire Sprite",
  type: "creature",
  energyCost: 2,
  power: 1,
  toughness: 2,
  abilities: [quickStrike]  // Same ability, no duplication
});
```

## Deck Validation

```typescript
export function validateDeckForPlay(deck: DeckTemplate): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const totalCards = getDeckCardCount(deck);
  if (totalCards < 15) {
    errors.push(`Deck must have at least 15 cards, found ${totalCards}`);
  }

  for (const cardEntry of deck.cards) {
    if (cardEntry.count > 4) {
      errors.push(`Too many copies of ${cardEntry.card.name}: ${cardEntry.count} (maximum 4)`);
    }
  }

  return { isValid: errors.length === 0, errors };
}
```

## Validation Rules

| Builder | Validation |
|---------|------------|
| `defineCard` | energyCost 0-10, power/toughness >= 0, spell must have effect |
| `defineAbility` | id, name, description required; effect must have type and target |
| `defineDeck` | name, type, description required; min 15 cards total; max 4 copies per card |

## Comparison: Before vs After

### Before (JSON-based)
```json
{
  "cards": [
    { "cardId": "flame_imp", "count": 4 }
  ]
}
```
- Typo in "flame_imp"? Runtime error (or silent failure)
- No autocomplete
- No refactoring support

### After (TypeScript Builder)
```typescript
cards: [
  { card: flameImp, count: 4 }
]
```
- Typo? Compile-time error
- Full autocomplete
- Rename refactoring works

## Related Patterns

- **Factory Pattern** - Builders use factories for final card creation
- **Registry Pattern** - Abilities registered after definition
