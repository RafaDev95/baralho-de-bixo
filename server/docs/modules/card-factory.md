# Card Factory Module

## Overview

The Card Factory module implements the **Factory Pattern** to centralize card creation logic. It provides type-safe, validated card creation for different card types (creatures, spells, enchantments, artifacts).

## Responsibilities

1. **Card Creation**: Create cards with proper validation
2. **Type Safety**: Ensure cards are created with correct types
3. **Validation**: Validate required fields and energy costs
4. **Extensibility**: Easy to add new card types

## Key Classes

### `CardFactory`

Static factory class with methods for creating different card types.

**Factory Methods:**
- `createCreature()`: Create a creature card
- `createSpell()`: Create a spell card
- `createEnchantment()`: Create an enchantment card
- `createArtifact()`: Create an artifact card
- `createCard()`: Generic card creation (backward compatibility)

## Design Pattern: Factory Pattern

### Why Factory Pattern?

**Before (Without Factory):**
```typescript
// Scattered card creation logic
const creature = {
  name: "Dragon",
  type: "creature",
  energyCost: 5,
  power: 5,
  toughness: 5,
  // Easy to forget required fields
  // No validation
};
```

**After (With Factory):**
```typescript
// Centralized, validated card creation
const creature = CardFactory.createCreature(
  "Dragon",
  5, // energyCost
  5, // power
  5, // toughness
  {
    rarity: "rare",
    colors: ["red"],
    description: "A powerful dragon"
  }
);
```

### Benefits

1. **Single Responsibility**: All card creation in one place
2. **Validation**: Ensures cards have required fields
3. **Type Safety**: Each factory method returns the correct type
4. **Easy to Extend**: Add new card types by adding factory methods
5. **Consistency**: All cards created the same way

## Example Usage

```typescript
// Create a creature
const dragon = CardFactory.createCreature(
  "Fire Dragon",
  5, // energy cost
  6, // power
  5, // toughness
  {
    rarity: "rare",
    colors: ["red"],
    description: "A powerful fire-breathing dragon"
  }
);

// Create a spell
const fireball = CardFactory.createSpell(
  "Fireball",
  3, // energy cost
  {
    type: "damage",
    target: "creature",
    value: 4
  },
  {
    rarity: "common",
    colors: ["red"],
    description: "Deal 4 damage to target creature"
  }
);
```

## File Structure

- `cards-factory.ts`: Main factory class
- `types.ts`: Type definitions for cards
- `constants.ts`: Required fields and defaults
- `strategies/`: Card type-specific creation strategies

