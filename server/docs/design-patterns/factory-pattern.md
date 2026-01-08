# Factory Pattern

## Overview

The Factory Pattern centralizes card creation through the `CardFactory` class. Combined with the Strategy pattern, it uses pluggable `CardFactoryStrategy` implementations to handle type-specific validation and creation for each card type (creature, spell, enchantment, artifact).

## Implementation

**Location**: `src/modules/cards/factory/cards-factory.ts`

### CardFactory Class

```typescript
export class CardFactory {
  private readonly cardFactoryStrategy: CardFactoryStrategy;

  constructor(cardFactoryStrategy: CardFactoryStrategy) {
    this.cardFactoryStrategy = cardFactoryStrategy;
  }

  createCard(cardData: CardDefinition): CardBase {
    this.validateBaseCard(cardData);
    return this.cardFactoryStrategy.createCard(cardData);
  }

  private validateBaseCard(card: CardDefinition): void {
    // Validates required fields and energy cost (0-10)
  }
}
```

### CardFactoryStrategy Interface

**Location**: `src/modules/cards/factory/types.ts`

```typescript
export interface CardFactoryStrategy {
  createCard(cardData: CardDefinition): CardDefinition;
}
```

### Strategy Implementations

**Location**: `src/modules/cards/factory/strategies/`

| Strategy | File | Purpose |
|----------|------|---------|
| `CreatureCardFactory` | `creature-card.ts` | Validates power/toughness, sets `canAttack: true` |
| `SpellCardFactory` | `spell-card.ts` | Validates spell effect |
| `EnchantmentCardFactory` | `enchantment-card.ts` | Validates persistent abilities |
| `ArtifactCardFactory` | `artifact-card.ts` | Validates artifact abilities |

## Why This Pattern?

The Factory + Strategy combination provides:
- **Centralized validation** - Base card rules in one place
- **Type-specific logic** - Each card type has its own factory strategy
- **Open/Closed Principle** - Add new card types without modifying CardFactory

## Benefits for This TCG

### 1. Single Point of Validation
All cards pass through `validateBaseCard()` which ensures:
- Required fields exist (name, type, rarity, description)
- Energy cost is valid integer 0-10
- No card bypasses validation

### 2. Type-Specific Rules Isolated
```typescript
// CreatureCardFactory validates creature-specific rules
class CreatureCardFactory implements CardFactoryStrategy {
  createCard(cardDefinition: CardDefinition): CreatureCard {
    validateRequiredFields(cardDefinition, ['power', 'toughness']);
    const power = validatePositiveNumber(cardDefinition.power, 'Power');
    const toughness = validatePositiveNumber(cardDefinition.toughness, 'Toughness');

    return {
      ...cardDefinition,
      type: 'creature',
      power,
      toughness,
      abilities: cardDefinition.abilities || [],
      canAttack: true,
    };
  }
}
```

### 3. Easy to Extend
Adding a new card type (e.g., "land") requires:
1. Create `LandCardFactory implements CardFactoryStrategy`
2. Add validation for land-specific fields
3. No changes to existing code

## Runtime Benefits

- **Fail-fast**: Invalid cards throw at creation time, not during gameplay
- **Type safety**: Each factory returns properly typed card (CreatureCard, SpellCard, etc.)
- **Memory efficiency**: Factories are lightweight, no duplication of validation logic

## Example Usage

```typescript
// Create factories for each card type
const creatureFactory = new CardFactory(new CreatureCardFactory());
const spellFactory = new CardFactory(new SpellCardFactory());

// Create a creature card
const dragon = creatureFactory.createCard({
  name: "Fire Elemental",
  type: "creature",
  rarity: "common",
  description: "A blazing elemental",
  energyCost: 3,
  power: 3,
  toughness: 3
});
// Returns CreatureCard with canAttack: true

// Create a spell card
const fireball = spellFactory.createCard({
  name: "Fireball",
  type: "spell",
  rarity: "common",
  description: "Deal 3 damage",
  energyCost: 3,
  effect: { type: "damage", target: "any", value: 3 }
});
// Returns SpellCard with validated effect
```

## Related Patterns

- **Strategy Pattern** - `CardFactoryStrategy` implementations
- **Builder Pattern** - `defineCard()` uses factories internally
