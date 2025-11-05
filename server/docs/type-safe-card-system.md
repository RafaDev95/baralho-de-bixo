# Type-Safe Card System Documentation

## Overview

The TCG Fuel project now features a fully type-safe card and deck system that replaces the previous JSON-based approach. This system provides compile-time validation, better developer experience, and easier maintenance.

## Key Benefits

### Type Safety
- ✅ **Compile-time error detection** - Catch errors before runtime
- ✅ **IDE autocomplete and refactoring** - Full IntelliSense support
- ✅ **Impossible to reference non-existent cards** - TypeScript prevents typos
- ✅ **Mana cost consistency enforced by types** - No more fire/red confusion

### Developer Experience
- ✅ **Easy to add new cards** - Copy-paste template with type safety
- ✅ **Reusable abilities across cards** - Plugin-based ability system
- ✅ **Clear validation errors with line numbers** - Better debugging
- ✅ **Better code organization** - Logical file structure

### Maintainability
- ✅ **Single source of truth for types** - No duplication
- ✅ **Refactoring-friendly** - IDE can find all usages
- ✅ **Easy to find card usages** - Go to definition works
- ✅ **Version control friendly** - Better diffs

## Architecture

### File Structure
```
src/modules/cards/
├── definitions/                    # TypeScript card definitions
│   ├── creatures/
│   │   ├── red-creatures.ts       # Red creature cards
│   │   ├── blue-creatures.ts      # Blue creature cards
│   │   └── index.ts
│   ├── spells/
│   │   ├── red-spells.ts          # Red spell cards
│   │   ├── blue-spells.ts         # Blue spell cards
│   │   └── index.ts
│   ├── enchantments/
│   │   └── index.ts
│   ├── artifacts/
│   │   └── index.ts
│   └── index.ts                   # Export all cards
├── abilities/                      # Plugin-based ability system
│   ├── ability-registry.ts        # Core ability definitions
│   ├── common/
│   │   └── combat-abilities.ts    # Reusable abilities
│   ├── effects/
│   │   └── spell-effects.ts       # Spell effect abilities
│   └── index.ts
└── factory/
    ├── card-definition-builder.ts  # Type-safe card builder
    ├── card-loader.ts             # Updated loader
    └── types.ts                   # Enhanced type definitions

src/modules/decks/
├── templates/                     # Type-safe deck templates
│   ├── starter/
│   │   ├── mono-red-aggro.ts     # Red aggro deck
│   │   ├── mono-blue-control.ts  # Blue control deck
│   │   └── index.ts
│   └── index.ts
└── deck-builder.ts               # Type-safe deck builder
```

## Usage Examples

### Creating Cards

#### Creature Card
```typescript
import { defineCard } from '../factory/card-definition-builder';
import { quickStrike } from '../abilities';

export const flameImp = defineCard({
  name: "Flame Imp",
  rarity: "common",
  colors: ["red"],
  type: "creature",
  description: "A small but aggressive imp",
  manaCost: { red: 1, generic: 0 },
  power: 2,
  toughness: 1,
  abilities: [quickStrike]
});
```

#### Spell Card
```typescript
export const fireball = defineCard({
  name: "Fireball",
  rarity: "common",
  colors: ["red"],
  type: "spell",
  description: "Deal 3 damage to target creature or player",
  manaCost: { red: 1, generic: 2 },
  effect: {
    type: "damage",
    target: "any",
    value: 3
  }
});
```

#### Enchantment Card
```typescript
import { burningCycle } from '../abilities';

export const eternalFlame = defineCard({
  name: "Eternal Flame",
  rarity: "rare",
  colors: ["red"],
  type: "enchantment",
  description: "At the start of your turn, deal 1 damage to each player",
  manaCost: { red: 2, generic: 1 },
  abilities: [burningCycle]
});
```

### Creating Abilities

```typescript
import { defineAbility } from './ability-registry';

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

### Creating Deck Templates

```typescript
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
    // ... more cards
  ]
});
```

## Type Definitions

### Card Types
```typescript
// Base card interface
interface BaseCardDefinition {
  name: string;
  type: CardType;
  rarity: CardRarity;
  colors: CardColor[];
  description: string;
  manaCost: ManaCostDefinition;
}

// Creature-specific properties
interface CreatureCardDefinition extends BaseCardDefinition {
  type: 'creature';
  power: number;
  toughness: number;
  abilities?: CardAbility[];
}

// Spell-specific properties
interface SpellCardDefinition extends BaseCardDefinition {
  type: 'spell';
  effect: {
    type: string;
    target: string;
    value?: number;
    [key: string]: unknown;
  };
}
```

### Mana Cost System
```typescript
interface ManaCostDefinition {
  red?: number;
  blue?: number;
  green?: number;
  white?: number;
  black?: number;
  generic: number; // Always required
}
```

### Ability System
```typescript
interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  trigger: AbilityTrigger;
  effect: {
    type: EffectType;
    target: EffectTarget;
    value?: number;
    condition?: string;
    duration?: string;
    [key: string]: unknown;
  };
}
```

## Validation

### Compile-Time Validation
The system provides automatic validation at compile time:

```typescript
// ❌ This will fail at compile time
const invalidCard = defineCard({
  name: "Test",
  type: "creature",
  manaCost: { red: -1 }, // Invalid negative mana
  power: 2,
  toughness: 1
  // Missing required fields will cause TypeScript errors
});
```

### Runtime Validation
Additional runtime validation ensures data integrity:

```typescript
// ❌ This will throw at runtime
defineCard({
  name: "Test",
  type: "creature",
  manaCost: { red: 1, generic: 0 },
  power: -1, // Invalid negative power
  toughness: 1
});
// Error: Invalid power: -1. Must be a non-negative integer.
```

## Migration from JSON

### Before (JSON)
```json
{
  "name": "Flame Imp",
  "type": "creature",
  "manaCost": { "fire": 1, "generic": 0 },
  "power": 2,
  "toughness": 1
}
```

### After (TypeScript)
```typescript
export const flameImp = defineCard({
  name: "Flame Imp",
  type: "creature",
  manaCost: { red: 1, generic: 0 }, // Consistent naming
  power: 2,
  toughness: 1,
  abilities: [quickStrike] // Type-safe ability reference
});
```

## System Architecture

The system is built entirely on TypeScript with no legacy compatibility layers. All cards and decks use type-safe definitions.

## Testing

The system includes comprehensive tests covering:

- ✅ Card definition validation
- ✅ Ability system functionality
- ✅ Deck template creation and validation
- ✅ Legacy compatibility
- ✅ Type safety enforcement

Run tests with:
```bash
pnpm test type-safe-system.test.ts
```

## Best Practices

### Adding New Cards
1. **Choose the right file** - Add to appropriate category (creatures/spells/etc.)
2. **Use existing abilities** - Reuse abilities from the ability registry
3. **Follow naming conventions** - Use consistent mana type names (red, blue, etc.)
4. **Add to exports** - Export from the appropriate index.ts file

### Creating New Abilities
1. **Define in appropriate file** - Combat abilities in `combat-abilities.ts`
2. **Use unique IDs** - Ensure ability IDs are unique across the system
3. **Include all required fields** - Name, description, trigger, effect
4. **Add to registry** - Export from the abilities index

### Building Decks
1. **Use type-safe references** - Reference cards directly, not by name
2. **Validate deck size** - Ensure minimum 15 cards
3. **Check color identity** - All cards must match deck colors
4. **Test deck validation** - Use `validateDeckForPlay()` function

## Troubleshooting

### Common Issues

#### "Ability effect must have a target"
- **Cause**: Ability definition missing `target` field
- **Solution**: Add `target: 'self'` or appropriate target to effect

#### "Deck must have at least 15 cards"
- **Cause**: Deck doesn't meet minimum size requirement
- **Solution**: Add more cards or increase counts

#### "Card colors don't match deck colors"
- **Cause**: Card has colors not in deck's color identity
- **Solution**: Either change deck colors or use different cards

#### Import errors
- **Cause**: Missing exports in index.ts files
- **Solution**: Add `export * from './filename'` to appropriate index.ts

### Debug Tips
- Use TypeScript strict mode for better error detection
- Check console for runtime validation errors
- Use IDE "Go to Definition" to trace card references
- Run tests frequently during development

## Future Enhancements

### Planned Features
- **Card Images**: Support for card artwork
- **Advanced Search**: Full-text search with filters
- **Deck Analytics**: Win rates and performance metrics
- **Card Recommendations**: AI-powered suggestions
- **Format Support**: Standard, modern, legacy formats

### Extensibility
The system is designed to be easily extensible:

- **New Card Types**: Add new interfaces extending `BaseCardDefinition`
- **New Abilities**: Add to ability registry with proper typing
- **New Effects**: Extend `EffectType` union type
- **New Triggers**: Add to `AbilityTrigger` union type

## Contributing

When contributing to the card system:

1. **Follow TypeScript best practices**
2. **Add comprehensive tests**
3. **Update documentation**
4. **Maintain backward compatibility**
5. **Use consistent naming conventions**

For questions or issues, refer to the project repository or create an issue.
