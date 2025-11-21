# Design Patterns in TCG Game

## Overview

This document explains the design patterns used in the card battle game and how they improve code quality, maintainability, and browser performance.

## Why Design Patterns?

Design patterns solve common software design problems. In our game, we use three key patterns:

1. **Factory Pattern** - Centralized card creation
2. **Strategy Pattern** - Encapsulated attack/ability behaviors
3. **Observer Pattern** - Decoupled event handling

## Factory Pattern

### Purpose
Centralize card creation logic to ensure consistency and validation.

### Implementation
All cards are created through `CardFactory` static methods:
- `CardFactory.createCreature()`
- `CardFactory.createSpell()`
- `CardFactory.createEnchantment()`
- `CardFactory.createArtifact()`

### Benefits

**Code Quality:**
- Single Responsibility: All card creation in one place
- Consistency: All cards created the same way
- Validation: Required fields checked automatically
- Type Safety: TypeScript ensures correct types

**Performance:**
- Smaller bundle size (less code duplication)
- Faster validation (single path)
- Better tree shaking (static methods)

**Maintainability:**
- Easy to add new card types
- Changes in one place
- Clear, documented API

### Example

```typescript
// Factory pattern usage
const card = CardFactory.createCreature(
  "Dragon", 5, 5, 5, // name, cost, power, toughness
  { rarity: "rare", colors: ["red"] }
);
// Validation happens automatically
// Type safety guaranteed
```

See [Factory Pattern Documentation](./design-patterns/factory-pattern.md) for details.

## Strategy Pattern

### Purpose
Encapsulate different attack behaviors and card abilities, making them interchangeable.

### Implementation
- **Attack Strategies**: `DirectAttackStrategy`, `DoubleStrikeStrategy`, `PiercingAttackStrategy`
- **Ability Strategies**: `DamageAbilityStrategy`, `HealAbilityStrategy`, `DrawCardsAbilityStrategy`

### Benefits

**Code Quality:**
- Open/Closed Principle: Open for extension, closed for modification
- Single Responsibility: Each strategy handles one behavior
- Testability: Each strategy testable independently
- Separation of Concerns: Game logic separate from card behaviors

**Performance:**
- Code splitting: Strategies can be lazy-loaded
- Tree shaking: Unused strategies removed
- Smaller runtime: Only active strategies in memory

**Maintainability:**
- Easy to add new attack/ability types
- Changes isolated to strategy classes
- Clear, documented behaviors

### Example

```typescript
// Strategy pattern usage
class GameEngine {
  attack(creature) {
    const strategy = AttackStrategyFactory.getStrategy(creature.abilities);
    return strategy.attack(creature.power);
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

See [Strategy Pattern Documentation](./design-patterns/strategy-pattern.md) for details.

## Observer Pattern

### Purpose
Decouple game events from their consumers (WebSocket, UI, logging, etc.).

### Implementation
`GameEventEmitter` allows components to subscribe to game events:
- Game engine emits events
- WebSocket manager listens and broadcasts
- Other listeners can be added (logging, analytics, AI)

### Benefits

**Code Quality:**
- Decoupling: Game logic independent of consumers
- Single Responsibility: Each component has one job
- Extensibility: Easy to add new listeners
- Testability: Test game logic without WebSocket

**Performance:**
- **No Polling**: Push-based updates via WebSocket
- **Lower Latency**: Immediate updates (< 100ms vs 1-2 seconds)
- **Less Bandwidth**: Only send when needed
- **Lower Server Load**: No constant polling requests

**Browser Performance:**
- Real-time updates without polling
- Efficient WebSocket connections
- Reduced client-side processing

### Example

```typescript
// Observer pattern with WebSocket
gameEventEmitter.on('card_played', (event) => {
  websocket.broadcast(event);
});

// Multiple listeners can react
gameEventEmitter.on('card_played', (event) => {
  analytics.track('card_played', event);
});
```

See [Observer Pattern Documentation](./design-patterns/observer-pattern.md) for details.

## How Patterns Improve Game Logic

### 1. Maintainability
- **Factory**: Changes to card creation in one place
- **Strategy**: New abilities don't require game engine changes
- **Observer**: New consumers don't require game engine changes

### 2. Testability
- **Factory**: Test card creation independently
- **Strategy**: Test each strategy independently
- **Observer**: Test game logic without WebSocket/UI

### 3. Extensibility
- **Factory**: Add new card types easily
- **Strategy**: Add new attack/ability types easily
- **Observer**: Add new event consumers easily

### 4. Performance
- **Factory**: Reduced code duplication, better optimization
- **Strategy**: Code splitting, tree shaking
- **Observer**: No polling, push-based updates

## Browser Performance Benefits

### Game Mechanics
- **Turn Structure**: 3 phases
- **Energy System**: Single number (1-10)
- **Combat**: Direct attacks
- **State Size**: Optimized for serialization

### Design Pattern Benefits
- **Factory**: Smaller bundle, faster validation
- **Strategy**: Code splitting, lazy loading
- **Observer**: Real-time updates, push-based

### Combined Impact
- **Faster Load Times**: Optimized code and data
- **Lower Latency**: Push-based updates
- **Better UX**: Responsive, real-time gameplay
- **Scalable**: Easy to add features without performance hit

## Summary

Design patterns in our game provide:

1. **Better Code Quality**: Clean, maintainable, testable code
2. **Better Performance**: Optimized for browser, real-time updates
3. **Better Extensibility**: Easy to add new features
4. **Better Developer Experience**: Clear patterns, good documentation

The combination of streamlined game mechanics and design patterns creates a game that runs smoothly in the browser while maintaining clean, maintainable code.

## Further Reading

- [Factory Pattern Details](./design-patterns/factory-pattern.md)
- [Strategy Pattern Details](./design-patterns/strategy-pattern.md)
- [Observer Pattern Details](./design-patterns/observer-pattern.md)
- [Module Documentation](./modules/)

