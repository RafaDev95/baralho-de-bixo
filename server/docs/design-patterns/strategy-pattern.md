# Strategy Pattern

## Overview

The Strategy Pattern encapsulates interchangeable behaviors behind a common interface. This TCG uses it in two places:
1. **Attack Strategies** - Different damage calculations (direct, double strike, piercing)
2. **Card Factory Strategies** - Type-specific card creation (creature, spell, enchantment, artifact)

## Implementation

### 1. Attack Strategies

**Location**: `src/lib/game/strategies/attack-strategy.ts`

```typescript
export interface AttackStrategy {
  attack(attackerPower: number, context?: Record<string, unknown>): AttackResult;
  getName(): string;
}

export interface AttackResult {
  damage: number;
  effects?: string[];
}
```

**Implementations:**

| Strategy | Behavior |
|----------|----------|
| `DirectAttackStrategy` | `damage = power` |
| `DoubleStrikeStrategy` | `damage = power * 2` |
| `PiercingAttackStrategy` | `damage = power + pierceAmount` |

```typescript
class DirectAttackStrategy implements AttackStrategy {
  getName(): string { return 'direct'; }

  attack(attackerPower: number): AttackResult {
    return { damage: attackerPower };
  }
}

class DoubleStrikeStrategy implements AttackStrategy {
  getName(): string { return 'double_strike'; }

  attack(attackerPower: number): AttackResult {
    return {
      damage: attackerPower * 2,
      effects: ['double_strike']
    };
  }
}

class PiercingAttackStrategy implements AttackStrategy {
  private readonly pierceAmount: number;

  constructor(pierceAmount = 1) {
    this.pierceAmount = pierceAmount;
  }

  getName(): string { return 'piercing'; }

  attack(attackerPower: number): AttackResult {
    return {
      damage: attackerPower + this.pierceAmount,
      effects: ['piercing']
    };
  }
}
```

### 2. Card Factory Strategies

**Location**: `src/modules/cards/factory/strategies/`

```typescript
export interface CardFactoryStrategy {
  createCard(cardData: CardDefinition): CardDefinition;
}
```

**Implementations:**

| Strategy | File | Validation |
|----------|------|------------|
| `CreatureCardFactory` | `creature-card.ts` | power, toughness must be >= 0 |
| `SpellCardFactory` | `spell-card.ts` | effect.type and effect.target required |
| `EnchantmentCardFactory` | `enchantment-card.ts` | abilities array required |
| `ArtifactCardFactory` | `artifact-card.ts` | abilities array required |

## Why This Pattern?

- **Open/Closed Principle** - Add new strategies without modifying game engine
- **Single Responsibility** - Each strategy handles one behavior
- **Testability** - Test each strategy in isolation
- **Runtime flexibility** - Swap strategies based on card abilities

## Benefits for This TCG

### 1. Game Engine Stays Clean
The game engine doesn't know attack details:

```typescript
// In GameEngine
const strategy = AttackStrategyFactory.getStrategy(creature.abilities);
const result = strategy.attack(creature.power);
// Game engine just uses result.damage
```

### 2. Easy to Add Attack Types
Adding a "Lifesteal" attack:
```typescript
class LifestealAttackStrategy implements AttackStrategy {
  getName(): string { return 'lifesteal'; }

  attack(attackerPower: number): AttackResult {
    return {
      damage: attackerPower,
      effects: ['lifesteal', 'heal_attacker']
    };
  }
}

// Register it
AttackStrategyFactory.registerStrategy('lifesteal', new LifestealAttackStrategy());
```

### 3. Card Types Have Clear Boundaries
Each factory strategy enforces its card type's rules:
- Creatures MUST have power/toughness
- Spells MUST have an effect
- Enchantments MUST have abilities

No if/else chains in the main factory - just delegate to strategy.

## Server Performance Benefits

- **No switch statements** - O(1) strategy lookup via Map
- **Stateless strategies** - Reused across all cards (memory efficient)
- **Lazy evaluation** - Strategy selected only when needed (attack time)

## Example: Combat Flow

```typescript
// Dragon Hatchling has double_strike ability
const dragonHatchling = {
  name: "Dragon Hatchling",
  power: 1,
  abilities: ["double_strike"]
};

// Game engine selects strategy based on abilities
const strategy = AttackStrategyFactory.getStrategy(dragonHatchling.abilities);
// Returns DoubleStrikeStrategy

const result = strategy.attack(dragonHatchling.power);
// result = { damage: 2, effects: ['double_strike'] }

// Apply damage to opponent
opponent.lifeTotal -= result.damage;
```

## AttackStrategyFactory

**Location**: `src/lib/game/strategies/attack-strategy.ts:100-133`

```typescript
export class AttackStrategyFactory {
  private static strategies: Map<string, AttackStrategy> = new Map([
    ['direct', new DirectAttackStrategy()],
    ['double_strike', new DoubleStrikeStrategy()],
    ['piercing', new PiercingAttackStrategy()],
  ]);

  static getStrategy(abilities?: string[]): AttackStrategy {
    if (!abilities || abilities.length === 0) {
      return this.strategies.get('direct')!;
    }

    if (abilities.includes('double_strike')) {
      return this.strategies.get('double_strike')!;
    }

    if (abilities.includes('piercing')) {
      return this.strategies.get('piercing')!;
    }

    return this.strategies.get('direct')!;
  }

  static registerStrategy(name: string, strategy: AttackStrategy): void {
    this.strategies.set(name, strategy);
  }
}
```

## Related Patterns

- **Factory Pattern** - Uses `CardFactoryStrategy` for card creation
- **Registry Pattern** - `AttackStrategyFactory.strategies` Map
