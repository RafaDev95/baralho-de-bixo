# Strategy Pattern

## Overview

The Strategy Pattern encapsulates different attack behaviors and card abilities. This allows cards to have different behaviors without modifying core game logic.

## Implementation

### Attack Strategies

**Location**: `server/src/lib/game/strategies/attack-strategy.ts`

```typescript
interface AttackStrategy {
  attack(attackerPower, context): AttackResult;
  getName(): string;
}

// Implementations:
- DirectAttackStrategy: Standard attack
- DoubleStrikeStrategy: Double damage
- PiercingAttackStrategy: Bonus damage
```

### Card Ability Strategies

**Location**: `server/src/lib/game/strategies/card-ability-strategy.ts`

```typescript
interface CardAbilityStrategy {
  execute(context): Promise<AbilityResult>;
  getName(): string;
  getDescription(): string;
}

// Implementations:
- DamageAbilityStrategy: Deal damage
- HealAbilityStrategy: Restore health
- DrawCardsAbilityStrategy: Draw cards
```

## Why This Pattern?

The Strategy Pattern provides:
- Easy to add new strategies
- Game engine stays simple
- Each strategy testable independently
- Open for extension, closed for modification

## Benefits for Our Game

1. **Extensibility**: Add new attack/ability types easily
2. **Testability**: Test each strategy independently
3. **Maintainability**: Changes isolated to strategy classes
4. **Flexibility**: Cards can use different strategies
5. **Separation of Concerns**: Game logic separate from card behaviors

## Browser Performance Impact

- **Code Splitting**: Strategies can be lazy-loaded
- **Tree Shaking**: Unused strategies removed
- **Smaller Runtime**: Only active strategies in memory

## Example

```typescript
// Strategy pattern usage
class GameEngine {
  attack(creature) {
    const strategy = AttackStrategyFactory.getStrategy(creature.abilities);
    const result = strategy.attack(creature.power);
    // Clean, extensible
  }
}

// Easy to add new strategies
class PoisonAttackStrategy implements AttackStrategy {
  attack(power) {
    return { damage: power, effects: ['poison'] };
  }
}
AttackStrategyFactory.registerStrategy('poison', new PoisonAttackStrategy());
```

