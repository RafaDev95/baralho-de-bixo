# Factory Pattern

## Overview

The Factory Pattern is used for centralized card creation. All cards are created through the `CardFactory` class, ensuring consistency, validation, and type safety.

## Implementation

**Location**: `server/src/modules/cards/factory/cards-factory.ts`

```typescript
export class CardFactory {
  static createCreature(name, energyCost, power, toughness, options?)
  static createSpell(name, energyCost, effect, options?)
  static createEnchantment(name, energyCost, abilities, options?)
  static createArtifact(name, energyCost, abilities, options?)
}
```

## Why This Pattern?

The Factory Pattern provides:
- Centralized card creation
- Consistent validation
- Type-safe creation
- Easy to maintain and extend

## Benefits for Our Game

1. **Consistency**: All cards created the same way
2. **Validation**: Required fields checked automatically
3. **Type Safety**: TypeScript ensures correct types
4. **Extensibility**: Easy to add new card types
5. **Maintainability**: Changes in one place

## Browser Performance Impact

- **Smaller Bundle**: Centralized logic reduces code duplication
- **Faster Validation**: Single validation path
- **Better Tree Shaking**: Static methods easier to optimize

## Example

```typescript
// Factory creation with validation
const card = CardFactory.createCreature(
  "Dragon",
  5, // energyCost
  5, // power
  5, // toughness
  {
    rarity: "rare",
    description: "A powerful dragon"
  }
);
// Validation happens automatically
// Type safety guaranteed
```

