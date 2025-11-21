# SimpleTCG  - Card Battle Game

A card battle game designed to run smoothly in the browser, implementing key design patterns for maintainability and performance.

## Overview

This project is a card battle game optimized for browser performance. The game uses design patterns (Factory, Strategy, Observer) to create clean, maintainable, and extensible code.

## Key Features

- **Streamlined Game Mechanics**: Fast, smooth gameplay
- **Design Patterns**: Factory, Strategy, and Observer patterns for clean architecture
- **Real-time Updates**: WebSocket-based push updates
- **Energy System**: Resource management (1-10 energy per turn)
- **Direct Combat**: Creatures attack opponent directly

## Game Rules

See [Game Rules Documentation](./server/docs/game-rules.md) for complete rules.

**Quick Summary:**
- 2 players, 20 health each
- Draw 1 card per turn
- Gain +1 energy per turn (max 10)
- Play cards, attack, win by reducing opponent to 0 health

## Design Patterns

This project demonstrates three key design patterns:

### 1. Factory Pattern
Centralized card creation with validation and type safety.

**Location**: `server/src/modules/cards/factory/cards-factory.ts`

**Benefits:**
- Consistent card creation
- Automatic validation
- Type safety
- Easy to extend

### 2. Strategy Pattern
Encapsulated attack behaviors and card abilities.

**Location**: `server/src/lib/game/strategies/`

**Benefits:**
- Easy to add new attack/ability types
- Testable in isolation
- Clean separation of concerns

### 3. Observer Pattern
Decoupled event handling for real-time updates.

**Location**: `server/src/lib/game/game-event-emitter.ts`

**Benefits:**
- No polling (push-based updates)
- Low latency (< 100ms)
- Easy to add new event consumers
- Decoupled game logic from WebSocket

## How Design Patterns Improve the Game

### Code Quality
- **Maintainability**: Changes isolated to specific modules
- **Testability**: Each component testable independently
- **Extensibility**: Easy to add new features

### Performance
- **Browser Performance**: Smaller bundle, faster validation, real-time updates
- **Server Performance**: No polling, efficient WebSocket connections
- **Scalability**: Easy to add features without performance hit

### Developer Experience
- **Clear Patterns**: Well-documented, consistent code
- **Easy to Understand**: Each pattern has clear purpose
- **Easy to Extend**: Add features without breaking existing code

See [Design Patterns Documentation](./server/docs/DESIGN_PATTERNS.md) for detailed explanation.

## Project Structure

```
server/
├── src/
│   ├── lib/
│   │   ├── game/
│   │   │   ├── game-engine-simple.ts      # Main game engine
│   │   │   ├── energy-system.ts            # Energy management
│   │   │   ├── game-event-emitter.ts       # Observer pattern
│   │   │   └── strategies/                 # Strategy pattern
│   │   └── websocket/                      # WebSocket integration
│   ├── modules/
│   │   └── cards/
│   │       └── factory/                    # Factory pattern
│   └── db/
│       └── schemas/                        # Database schemas
└── docs/
    ├── DESIGN_PATTERNS.md                  # Design patterns overview
    ├── design-patterns/                    # Pattern details
    ├── modules/                            # Module documentation
    └── game-rules.md                       # Game rules
```

## Documentation

- [Design Patterns Overview](./server/docs/DESIGN_PATTERNS.md)
- [Game Rules](./server/docs/game-rules.md)
- [Module Documentation](./server/docs/modules/)
  - [Game Engine](./server/docs/modules/game-engine.md)
  - [Card Factory](./server/docs/modules/card-factory.md)
  - [Energy System](./server/docs/modules/energy-system.md)
  - [WebSocket Integration](./server/docs/modules/websocket-integration.md)
  - [Game Events](./server/docs/modules/game-events.md)

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- npm or yarn

### Installation
```bash
npm install
```

### Database Setup
```bash
# Run migrations
npm run migrate
```

### Start Server
```bash
npm run dev
```

## Game Mechanics

**Turn Structure:**
- 3 phases: Draw → Play → End

**Resource System:**
- Energy system (1-10 energy per turn)

**Combat:**
- Direct attack (creatures attack opponent directly)

**Mechanics:**
- Card playing, combat, energy management

## Performance Features

- WebSocket push updates
- < 100ms latency
- Small state payloads
- Efficient database queries
- Optimized validation logic

## Future Enhancements

The design patterns make it easy to add:
- More card types (Factory pattern)
- New attack/ability types (Strategy pattern)
- Analytics, logging, AI (Observer pattern)
- Multiplayer support
- Tournament mode

## Contributing

This project demonstrates design patterns and simplified game architecture. Contributions should maintain:
- Clean code with design patterns
- Comprehensive documentation
- Performance optimization
- Browser compatibility

## License

[Your License Here]

