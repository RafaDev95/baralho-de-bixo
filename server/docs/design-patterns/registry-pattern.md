# Registry Pattern

## Overview

The Registry Pattern provides centralized storage and lookup for objects by key. This TCG uses it for attack strategies and abilities, enabling O(1) lookup and runtime extensibility without modifying existing code.

## Implementation

### 1. Attack Strategy Registry

**Location**: `src/lib/game/strategies/attack-strategy.ts`

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

### 2. Ability Registry

**Location**: `src/modules/cards/abilities/ability-registry.ts`

```typescript
export type AbilityRegistry = Record<string, AbilityDefinition>;

export function createAbilityRegistry(
  abilities: AbilityDefinition[]
): AbilityRegistry {
  const registry: AbilityRegistry = {};

  for (const ability of abilities) {
    if (registry[ability.id]) {
      throw new Error(`Duplicate ability id: ${ability.id}`);
    }
    registry[ability.id] = ability;
  }

  return registry;
}

export function getAbility(
  registry: AbilityRegistry,
  id: string
): AbilityDefinition | undefined {
  return registry[id];
}

export function validateAbilityExists(
  registry: AbilityRegistry,
  id: string
): void {
  if (!registry[id]) {
    throw new Error(`Ability not found: ${id}`);
  }
}
```

## Why This Pattern?

- **O(1) lookup** - Map/object access is constant time
- **Centralized management** - All strategies/abilities in one place
- **Runtime extensibility** - Add new items without code changes
- **No switch statements** - Eliminates error-prone conditional chains

## Benefits for This TCG

### 1. Avoid Switch Statement Explosion
```typescript
// WITHOUT Registry - grows with every attack type
function getAttackDamage(creature, attackType) {
  switch (attackType) {
    case 'direct': return creature.power;
    case 'double_strike': return creature.power * 2;
    case 'piercing': return creature.power + 1;
    case 'lifesteal': return creature.power;  // Keep adding cases...
    default: return creature.power;
  }
}

// WITH Registry - never changes
function getAttackDamage(creature) {
  const strategy = AttackStrategyFactory.getStrategy(creature.abilities);
  return strategy.attack(creature.power);
}
```

### 2. Runtime Extension
```typescript
// Add new attack type at runtime - no code changes needed
class LifestealStrategy implements AttackStrategy {
  getName() { return 'lifesteal'; }
  attack(power: number) {
    return { damage: power, effects: ['lifesteal'] };
  }
}

AttackStrategyFactory.registerStrategy('lifesteal', new LifestealStrategy());

// Now any creature with 'lifesteal' ability uses this strategy
```

### 3. Duplicate Detection
```typescript
// Ability registry catches duplicates
const registry = createAbilityRegistry([
  quickStrike,
  growth,
  quickStrike  // Throws: "Duplicate ability id: quick_strike"
]);
```

### 4. Safe Lookup with Validation
```typescript
// Safe lookup - returns undefined if not found
const ability = getAbility(registry, 'unknown_ability');
if (!ability) {
  // Handle missing ability
}

// Strict validation - throws if missing
validateAbilityExists(registry, 'quick_strike');  // OK
validateAbilityExists(registry, 'typo_ability');  // Throws!
```

## Performance Benefits

| Operation | Without Registry | With Registry |
|-----------|-----------------|---------------|
| Lookup | O(n) switch/if chain | O(1) Map.get() |
| Add new item | Modify source code | `registerStrategy()` |
| Memory | N/A | Single instance per strategy |

## Usage Flow

```
1. Game starts
   ↓
2. Built-in strategies registered in Map initialization
   ↓
3. Card attacks:
   - Get card abilities: ['double_strike']
   - Lookup in registry: strategies.get('double_strike')
   - Execute strategy: strategy.attack(power)
   ↓
4. (Optional) Plugin adds new strategy at runtime
   - registerStrategy('poison', new PoisonStrategy())
   ↓
5. New cards can use 'poison' ability immediately
```

## Comparison: Registry vs Switch

### Switch Statement (Anti-pattern)
```typescript
// Every new attack type requires modifying this function
function calculateDamage(creature) {
  if (creature.abilities.includes('double_strike')) {
    return creature.power * 2;
  }
  if (creature.abilities.includes('piercing')) {
    return creature.power + 1;
  }
  // More conditions...
  return creature.power;
}
```

**Problems:**
- Violates Open/Closed Principle
- Hard to test individual strategies
- Risk of breaking existing code

### Registry Pattern
```typescript
// This function never changes
function calculateDamage(creature) {
  const strategy = AttackStrategyFactory.getStrategy(creature.abilities);
  return strategy.attack(creature.power).damage;
}
```

**Benefits:**
- Open for extension
- Each strategy tested independently
- Existing code unaffected by new strategies

## Related Patterns

- **Strategy Pattern** - Registry stores strategy instances
- **Factory Pattern** - Registry acts as factory for strategy lookup
- **Singleton Pattern** - Registry often implemented as static class
