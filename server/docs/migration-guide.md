# Migration Guide: JSON to TypeScript Card System

## Overview

This guide helps developers migrate from the old JSON-based card system to the new type-safe TypeScript system.

## Migration Steps

### 1. Understanding the Changes

#### Before (JSON System)
- Cards defined in `card-definitions.json`
- Manual string references in deck templates
- Runtime-only validation
- Inconsistent mana naming (fire/red, water/blue)

#### After (TypeScript System)
- Cards defined in TypeScript modules
- Direct type-safe references
- Compile-time + runtime validation
- Consistent mana naming (red, blue, green, white, black)

### 2. Card Definition Migration

#### Step 1: Create Card Definition File
Choose the appropriate category and create a new TypeScript file:

```typescript
// src/modules/cards/definitions/creatures/red-creatures.ts
import { defineCard } from '../../factory/card-definition-builder';
import { quickStrike } from '../../abilities';

export const flameImp = defineCard({
  // Card definition here
});
```

#### Step 2: Convert JSON to TypeScript
Transform your JSON card definition:

**JSON Format:**
```json
{
  "name": "Flame Imp",
  "rarity": "common",
  "colors": ["red"],
  "type": "creature",
  "description": "A small but aggressive imp",
  "manaCost": { "fire": 1, "generic": 0 },
  "power": 2,
  "toughness": 1,
  "abilities": [
    {
      "name": "Quick Strike",
      "description": "When played, deal 2 damage to target player",
      "trigger": "on_enter_battlefield",
      "effect": {
        "type": "damage",
        "target": "player",
        "value": 2
      }
    }
  ]
}
```

**TypeScript Format:**
```typescript
export const flameImp = defineCard({
  name: "Flame Imp",
  rarity: "common",
  colors: ["red"],
  type: "creature",
  description: "A small but aggressive imp",
  manaCost: { red: 1, generic: 0 }, // Note: fire -> red
  power: 2,
  toughness: 1,
  abilities: [quickStrike] // Reference to ability, not inline definition
});
```

#### Step 3: Handle Abilities
Extract abilities to the ability system:

```typescript
// src/modules/cards/abilities/common/combat-abilities.ts
export const quickStrike = defineAbility({
  id: 'quick_strike',
  name: 'Quick Strike',
  description: 'When played, deal 2 damage to target player',
  trigger: 'on_enter_battlefield',
  effect: {
    type: 'damage',
    target: 'player',
    value: 2
  }
});
```

#### Step 4: Export Card
Add to the appropriate index file:

```typescript
// src/modules/cards/definitions/creatures/index.ts
export * from './red-creatures';
```

### 3. Deck Template Migration

#### Step 1: Create Deck Template File
```typescript
// src/modules/decks/templates/starter/mono-red-aggro.ts
import { defineDeck } from '../deck-builder';
import { flameImp, fireball, fireElemental } from '../../cards/definitions';

export const monoRedAggro = defineDeck({
  name: 'Mono Red Aggro',
  colors: ['red'],
  description: 'An aggressive fire deck',
  type: 'starter',
  cards: [
    { card: flameImp, count: 4 },
    { card: fireElemental, count: 3 },
    { card: fireball, count: 4 },
  ]
});
```

#### Step 2: Update Legacy References
Update any code that references the old deck format:

```typescript
// Before
const deck = MONO_RED_DECK; // String-based card names

// After
const deck = monoRedAggro; // Direct type-safe references
```

### 4. Mana Cost Migration

#### Mana Type Mapping
Update mana cost references:

| Old (JSON) | New (TypeScript) |
|------------|------------------|
| `fire`     | `red`           |
| `water`    | `blue`          |
| `wind`     | `green`         |
| `generic`  | `generic`       |

#### Example Migration
```typescript
// Before
manaCost: { fire: 1, water: 2, generic: 1 }

// After  
manaCost: { red: 1, blue: 2, generic: 1 }
```

### 5. Service Layer Updates

#### CardLoader Changes
The CardLoader now imports TypeScript definitions instead of reading JSON:

```typescript
// Before
const loader = CardLoader.getInstance(fileSystem);

// After
const loader = CardLoader.getInstance(); // No fileSystem needed
```

#### Deck Service Updates
Update deck creation to use new templates:

```typescript
// Before
const deck = createDeckFromTemplate('Mono Red Aggro');

// After
const deck = createDeckFromTemplate(monoRedAggro);
```

### 6. Testing Updates

#### Update Test Files
Replace JSON-based tests with TypeScript-based tests:

```typescript
// Before
const testCard = JSON.parse(cardJson);

// After
import { flameImp } from '../src/modules/cards/definitions';
const testCard = flameImp;
```

#### Add Type Safety Tests
```typescript
describe('Type Safety', () => {
  it('should prevent invalid card references', () => {
    // TypeScript will catch this at compile time
    const invalidCard = nonExistentCard; // ❌ Compile error
  });
});
```

## Common Migration Issues

### Issue 1: Missing Ability Targets
**Error**: `Ability effect must have a target`

**Solution**: Add target to ability effects:
```typescript
// Before
effect: { type: 'damage', value: 2 }

// After
effect: { type: 'damage', target: 'player', value: 2 }
```

### Issue 2: Inconsistent Mana Names
**Error**: Type errors in mana cost

**Solution**: Update mana type names:
```typescript
// Before
manaCost: { fire: 1, generic: 0 }

// After
manaCost: { red: 1, generic: 0 }
```

### Issue 3: Missing Card Exports
**Error**: `Cannot find module` or import errors

**Solution**: Add exports to index files:
```typescript
// src/modules/cards/definitions/creatures/index.ts
export * from './red-creatures';
export * from './blue-creatures';
```

### Issue 4: Deck Size Validation
**Error**: `Deck must have at least 15 cards`

**Solution**: Ensure deck meets minimum requirements:
```typescript
// Add more cards or increase counts
cards: [
  { card: flameImp, count: 4 },
  { card: fireball, count: 4 },
  { card: fireElemental, count: 4 },
  { card: inferno, count: 3 }
]
```

## Validation Checklist

Before considering migration complete:

- [ ] All cards converted to TypeScript definitions
- [ ] All abilities extracted to ability system
- [ ] All deck templates updated
- [ ] Mana costs use consistent naming (red/blue/green)
- [ ] All exports added to index files
- [ ] Tests updated and passing
- [ ] Legacy code completely removed
- [ ] Documentation updated

## Migration Complete ✅

The migration from JSON to TypeScript has been **fully completed** with all legacy code removed:

1. ✅ **JSON files removed** - No more JSON-based card definitions
2. ✅ **Type-safe system active** - All cards use TypeScript definitions
3. ✅ **Legacy code removed** - All backward compatibility functions removed
4. ✅ **Consistent naming** - Mana costs use red/blue/green throughout
5. ✅ **Tests updated** - All tests use the new system
6. ✅ **Clean codebase** - No deprecated functions or interfaces

## Benefits After Migration

### Immediate Benefits
- ✅ Compile-time error detection
- ✅ IDE autocomplete and refactoring
- ✅ Better code organization
- ✅ Consistent naming conventions

### Long-term Benefits
- ✅ Easier maintenance
- ✅ Better testability
- ✅ Reduced bugs
- ✅ Improved developer experience

## Support

For migration assistance:

1. **Check documentation** - Review type-safe system docs
2. **Run tests** - Ensure all tests pass
3. **Use TypeScript strict mode** - Catch more errors
4. **Ask for help** - Create issue in repository

## Example Complete Migration

Here's a complete example of migrating a card and deck:

### Card Migration
```typescript
// Before: JSON
{
  "name": "Dragon Hatchling",
  "type": "creature",
  "manaCost": { "fire": 1, "generic": 1 },
  "power": 1,
  "toughness": 1,
  "abilities": [/* inline ability */]
}

// After: TypeScript
export const dragonHatchling = defineCard({
  name: "Dragon Hatchling",
  type: "creature",
  manaCost: { red: 1, generic: 1 },
  power: 1,
  toughness: 1,
  abilities: [growth] // Reusable ability
});
```

### Deck Migration
```typescript
// Before: String-based
const deck = {
  name: "Mono Red",
  cards: {
    "Dragon Hatchling": 3,
    "Flame Imp": 4
  }
};

// After: Type-safe
export const monoRed = defineDeck({
  name: "Mono Red",
  colors: ["red"],
  type: "starter",
  cards: [
    { card: dragonHatchling, count: 3 },
    { card: flameImp, count: 4 }
  ]
});
```

This migration provides a solid foundation for future card additions and system improvements.
