# API Documentation

**Project**: Simple TCG API Server  
**Version**: 1.0.0  
**Last Updated**: 2024

---

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Architecture Overview](#architecture-overview)
3. [Design Patterns](#design-patterns)
4. [Best Practices](#best-practices)
5. [Game Mechanics](#game-mechanics)
6. [Database Schema](#database-schema)
7. [API Structure](#api-structure)
8. [WebSocket System](#websocket-system)
9. [Testing Strategy](#testing-strategy)
10. [Development Workflow](#development-workflow)

---

## Technologies Used

### Core Framework & Runtime

- **Hono** (`^4.6.14`): Fast, lightweight web framework for building APIs
  - Uses `OpenAPIHono` for OpenAPI integration
  - Built-in TypeScript support
  - High performance with edge runtime compatibility

- **Bun** (`1.1.0`): JavaScript runtime, bundler, and package manager
  - Fast execution and package installation
  - Native TypeScript support
  - Built-in test runner

- **TypeScript** (`^5.6.3`): Type-safe JavaScript
  - Strict mode enabled
  - Modern ES2022 target
  - Path aliases configured (`@/*` for `./src/*`)

### Database & ORM

- **PostgreSQL** (`16`): Relational database
  - Dockerized for development
  - Production-ready with connection pooling

- **Drizzle ORM** (`0.38.0`): Type-safe SQL ORM
  - Schema-first approach
  - TypeScript inference
  - Migration system with `drizzle-kit`
  - Relations support

- **Drizzle Zod** (`^0.6.1`): Schema validation integration
  - Automatic schema generation from Drizzle tables
  - Runtime validation

### API Documentation

- **@hono/zod-openapi** (`^0.18.3`): OpenAPI integration for Hono
  - Type-safe route definitions
  - Automatic schema validation
  - Request/response type inference

- **@scalar/hono-api-reference** (`^0.5.168`): Interactive API documentation
  - Scalar UI for OpenAPI docs
  - Available at `/reference` endpoint

- **@asteasolutions/zod-to-openapi** (`^7.3.0`): Zod to OpenAPI conversion

### Validation & Schema

- **Zod** (`^3.24.1`): Schema validation library
  - Runtime type validation
  - Environment variable validation
  - Request/response validation

### Logging

- **Pino** (`^9.6.0`): Fast JSON logger
  - Structured logging
  - Pretty printing in development
  - Request ID tracking

- **hono-pino** (`^0.7.0`): Pino integration for Hono

### Real-time Communication

- **ws** (`^8.18.3`): WebSocket library
  - Real-time game updates
  - Room-based communication
  - Event-driven architecture

### Utilities

- **stoker** (`^1.4.2`): Hono utilities and helpers
  - HTTP status codes
  - OpenAPI helpers
  - Middleware utilities

- **uid** (`^2.0.2`): Unique ID generation

- **email-validator** (`^2.0.4`): Email validation

### Development Tools

- **tsx** (`^4.19.2`): TypeScript execution
  - Watch mode for development
  - Fast compilation

- **tsup** (`^8.3.5`): TypeScript bundler
  - Production builds
  - Minification

- **ESLint** (`^8.57.0`): Code linting
  - TypeScript rules
  - Prettier integration

- **Prettier** (`^3.2.5`): Code formatting

### Testing

- **testcontainers** (`^11.0.3`): Integration testing
  - PostgreSQL test containers
  - Isolated test environments
  - No manual database setup required

- **@testcontainers/postgresql** (`^11.0.3`): PostgreSQL test container

### Infrastructure

- **Docker** & **Docker Compose**: Containerization
  - Development environment
  - Database container
  - Hot reload support

- **dotenv** (`^16.4.5`): Environment variable management

---

## Architecture Overview

### Project Structure

```
server/
├── src/
│   ├── db/                    # Database layer
│   │   ├── config/            # Database configuration
│   │   ├── migrations/        # Drizzle migrations
│   │   └── schemas/           # Drizzle schema definitions
│   ├── lib/                   # Shared libraries
│   │   ├── game/              # Game engine
│   │   │   ├── strategies/    # Strategy pattern implementations
│   │   │   ├── energy-system.ts
│   │   │   ├── game-engine-simple.ts
│   │   │   ├── game-event-emitter.ts
│   │   │   └── game-event-types.ts
│   │   ├── websocket/         # WebSocket server
│   │   ├── configure-openapi.ts
│   │   └── create-app.ts
│   ├── middleware/            # HTTP middleware
│   │   └── pino-logger.ts
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication
│   │   ├── cards/             # Card management
│   │   ├── decks/             # Deck management
│   │   ├── game-rooms/        # Game room management
│   │   ├── game-sessions/     # Game session management
│   │   └── players/           # Player management
│   ├── server/                # Server entry point
│   │   ├── app.ts             # App configuration
│   │   └── index.ts           # Server startup
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   └── env.ts                 # Environment validation
├── tests/                     # Test files
├── docs/                      # Documentation
└── docker-compose.yml         # Docker configuration
```

### Module Organization

Each module follows a consistent structure:

```
modules/{feature}/
├── index.ts              # Route registration
├── {feature}.routes.ts   # OpenAPI route definitions
├── {feature}.handlers.ts # Request handlers
└── (optional subdirectories)
```

### Application Flow

1. **Request Entry**: `src/server/index.ts` → `src/server/app.ts`
2. **Middleware**: Logger, error handling, OpenAPI validation
3. **Route Matching**: Module-based routing
4. **Handler Execution**: Business logic in handlers
5. **Database Access**: Drizzle ORM with transactions
6. **Response**: JSON with proper status codes

---

## Design Patterns

### 1. Factory Pattern

**Purpose**: Centralized card creation with validation

**Location**: `src/modules/cards/factory/cards-factory.ts`

**Implementation**:
```typescript
export class CardFactory {
  private readonly cardFactoryStrategy: CardFactoryStrategy;
  
  createCard(cardData: CardDefinition): CardBase {
    this.validateBaseCard(cardData);
    return this.cardFactoryStrategy.createCard(cardData);
  }
}
```

**Benefits**:
- Single responsibility for card creation
- Consistent validation
- Type-safe creation
- Easy to extend with new card types

**Usage**:
- Card creation in card definitions
- Deck building
- Starter deck generation

### 2. Strategy Pattern

**Purpose**: Encapsulate different attack behaviors and card abilities

**Locations**:
- `src/lib/game/strategies/attack-strategy.ts`
- `src/lib/game/strategies/card-ability-strategy.ts`

**Implementation**:
```typescript
interface AttackStrategy {
  attack(attackerPower: number, context: AttackContext): AttackResult;
  getName(): string;
}

// Implementations:
// - DirectAttackStrategy
// - DoubleStrikeStrategy
// - PiercingAttackStrategy
```

**Benefits**:
- Easy to add new strategies
- Game engine stays simple
- Each strategy testable independently
- Open for extension, closed for modification

**Registry Pattern**: Used with Strategy pattern to avoid switch statements:
```typescript
const strategyRegistry = {
  creature: (data) => new CreatureCardStrategy(data),
  spell: (data) => new SpellCardStrategy(data),
  // ...
} satisfies Record<CardType, (data) => CardFactory>;
```

### 3. Observer Pattern

**Purpose**: Decouple game logic from event handling (WebSocket, UI updates)

**Location**: `src/lib/game/game-event-emitter.ts`

**Implementation**:
```typescript
export class GameEventEmitter {
  private listeners: Map<GameEventType, Set<EventListener>> = new Map();
  
  on(eventType: GameEventType, listener: EventListener): () => void
  async emit(event: GameEvent): Promise<void>
}
```

**Event Types**:
- `game_started`
- `game_ended`
- `turn_started`
- `turn_ended`
- `card_played`
- `card_drawn`
- `attack_declared`
- `damage_dealt`
- `player_health_changed`
- `energy_changed`
- `phase_changed`
- `game_state_updated`

**Benefits**:
- Decoupling: Game logic doesn't know about WebSocket/UI
- Extensibility: Easy to add new event listeners
- Testability: Test game logic without WebSocket
- Real-time updates: Push-based instead of polling

**Usage**:
- Game engine emits events
- WebSocket manager listens and broadcasts
- Future: UI updates, analytics, logging

### 4. Singleton Pattern

**Purpose**: Single instances of critical services

**Examples**:
- `gameEventEmitter`: Global event emitter
- `gameEngine`: Game engine instance
- `gameRoomSocketManager`: WebSocket room manager
- `gameSocketManager`: Game-to-WebSocket bridge

### 5. Repository Pattern (Implicit)

**Purpose**: Database access abstraction through Drizzle ORM

**Implementation**:
- Drizzle queries abstracted in handlers
- Transaction support for atomic operations
- Type-safe queries with schema inference

---

## Best Practices

### 1. Type Safety

**Strict TypeScript Configuration**:
```json
{
  "strict": true,
  "noEmit": true,
  "verbatimModuleSyntax": true
}
```

**Practices**:
- Use interfaces over types for extensibility
- Leverage Drizzle's type inference
- Zod schemas for runtime validation
- Type-safe route definitions with OpenAPI

**Example**:
```typescript
// Type-safe route definition
export const playerSignUp = createRoute({
  method: 'post',
  path: '/signup',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PlayerSignUpRequestSchema, // Zod schema
        },
      },
    },
  },
  // ...
});
```

### 2. Error Handling

**Centralized Error Handling**:
- `stoker/middlewares` for error handling
- Consistent error response format
- Proper HTTP status codes

**Error Response Format**:
```typescript
{
  success: false,
  error: "Error message",
  // Optional additional fields
}
```

**Transaction Safety**:
- All database mutations in transactions
- Rollback on errors
- Atomic operations

### 3. Environment Configuration

**Zod-based Validation**:
```typescript
const envSchema = z.object({
  DATABASE_HOST: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().default(3001),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  // ...
});

export const env = envSchema.parse(process.env);
```

**Benefits**:
- Runtime validation
- Type inference
- Clear error messages
- Fail-fast on startup

### 4. Logging

**Structured Logging with Pino**:
- JSON logs in production
- Pretty logs in development
- Request ID tracking
- Log levels configurable via env

**Implementation**:
```typescript
export const customLogger = () => {
  return pinoLogger({
    pino: pino(
      { level: process.env.LOG_LEVEL || 'info' },
      env.NODE_ENV === 'production' ? undefined : pretty()
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
};
```

### 5. Database Best Practices

**Schema-First Approach**:
- Drizzle schemas define database structure
- Migrations generated automatically
- Type-safe queries

**Transaction Usage**:
```typescript
await db.transaction(async (tx) => {
  // Multiple operations
  await tx.insert(...);
  await tx.update(...);
  // Atomic commit or rollback
});
```

**Query Optimization**:
- Use Drizzle relations for joins
- Leverage query builder for complex queries
- Avoid N+1 queries with proper relations

**Example**:
```typescript
const room = await db.query.gameRoomsTable.findFirst({
  where: eq(gameRoomsTable.id, roomId),
  with: {
    players: true, // Automatic join
  },
});
```

### 6. Code Organization

**Module-Based Architecture**:
- Each feature in its own module
- Clear separation of concerns
- Easy to locate code

**File Naming Conventions**:
- `index.ts`: Module exports
- `{feature}.routes.ts`: Route definitions
- `{feature}.handlers.ts`: Request handlers
- `{feature}.types.ts`: TypeScript types

**Path Aliases**:
```typescript
// tsconfig.json
{
  "paths": {
    "@/*": ["./src/*"],
    "$/*": ["./*"]
  }
}
```

### 7. API Design

**RESTful Principles**:
- Resource-based URLs
- Proper HTTP methods
- Status codes

**OpenAPI Integration**:
- Type-safe routes
- Automatic validation
- Interactive documentation

**Response Consistency**:
```typescript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  error: "Error message"
}
```

### 8. Testing Strategy

**Testcontainers for Integration Tests**:
- Isolated PostgreSQL instances
- No manual setup
- Clean state per test

**Test Structure**:
```typescript
describe('Feature', () => {
  beforeAll(async () => {
    await initializeTestDatabase();
  });
  
  afterAll(async () => {
    await cleanupTestDatabase();
  });
  
  // Tests...
});
```

### 9. Security Considerations

**Input Validation**:
- Zod schemas for all inputs
- Email validation
- Type coercion where appropriate

**SQL Injection Prevention**:
- Drizzle ORM parameterized queries
- No raw SQL with user input

**Environment Variables**:
- Sensitive data in env vars
- Validation on startup
- No secrets in code

### 10. Performance

**Connection Pooling**:
- PostgreSQL connection pool
- Configurable pool size

**Efficient Queries**:
- Use Drizzle relations
- Avoid unnecessary data fetching
- Index important columns

**Caching Strategy** (Future):
- Game state caching
- Card definition caching
- Query result caching

---

## Game Mechanics

### 1. Game Flow

**Game Session Lifecycle**:
1. **Room Creation**: Players join a game room
2. **Ready Status**: Players mark themselves ready
3. **Game Start**: All players ready → game session created
4. **Turn-Based Play**: Alternating turns
5. **Game End**: Win condition met or concession

### 2. Turn Structure

**Phases**:
- `untap` (future)
- `upkeep` (future)
- `draw`
- `main`
- `combat` (future)
- `end`

**Steps**:
- Defined per phase
- State machine for phase transitions

**Current Implementation**:
- Simplified turn structure
- Energy system per turn
- Card draw per turn

### 3. Energy System

**Mechanics**:
- Players start with 1 energy
- Gain +1 energy per turn (max 10)
- Energy resets to max at turn start
- Cards cost energy to play

**Implementation**: `src/lib/game/energy-system.ts`

**Methods**:
- `getPlayerEnergy()`: Get current energy
- `canPlayCard()`: Check if card can be played
- `payEnergyCost()`: Deduct energy
- `startTurn()`: Reset energy to max

### 4. Card System

**Card Types**:
- `creature`: Can attack, has power/toughness
- `spell`: One-time effect
- `enchantment`: Persistent effect
- `artifact`: Equipment/utility

**Card Zones**:
- `library`: Deck
- `hand`: Player's hand
- `battlefield`: In play
- `graveyard`: Discarded/destroyed
- `exile`: Removed from game
- `stack`: Resolving effects

**Card Properties**:
- `name`: Card name
- `type`: Card type enum
- `rarity`: common, uncommon, rare, mythic
- `description`: Flavor text
- `energyCost`: Energy required (0-10)
- `power`: Attack power (creatures)
- `toughness`: Defense (creatures)
- `abilities`: JSONB array of abilities
- `effect`: JSONB effect data

### 5. Combat System

**Attack Strategies**:
- `DirectAttackStrategy`: Standard attack
- `DoubleStrikeStrategy`: Double damage
- `PiercingAttackStrategy`: Bonus damage

**Implementation**: `src/lib/game/strategies/attack-strategy.ts`

**Attack Flow** (Future):
1. Declare attackers
2. Declare blockers
3. Calculate damage
4. Apply damage
5. Check for deaths

### 6. Card Abilities

**Ability System**:
- Plugin-based ability registry
- Reusable abilities across cards
- Trigger-based execution

**Ability Types**:
- Combat abilities
- Spell effects
- Enchantment effects
- Triggered abilities

**Implementation**: `src/lib/game/strategies/card-ability-strategy.ts`

### 7. Game State Management

**In-Memory State**:
- `GameState` Map for active games
- Fast access to current state
- Synchronized with database

**Database Persistence**:
- Game sessions table
- Game state snapshots
- Action history
- Card positions

**State Synchronization**:
- Events emitted on state changes
- WebSocket broadcasts
- Database updates in transactions

### 8. Deck System

**Deck Types**:
- `starter`: Pre-built decks
- `custom`: Player-created decks

**Deck Validation**:
- Minimum card count
- Maximum card count per card
- Format validation (future)

**Starter Decks**:
- Defined in `src/lib/starter-decks-definition.ts`
- Type-safe deck definitions
- Automatic deck creation

---

## Database Schema

### Core Tables

#### `players`
- `id`: Primary key
- `username`: Player username
- `email`: Unique email
- `balance`: Player currency (future)
- `rank`: Player ranking
- `created_at`, `updated_at`: Timestamps

#### `cards`
- `id`: Primary key
- `name`: Card name
- `type`: Card type enum
- `rarity`: Rarity enum
- `description`: Card description
- `power`: Attack power (creatures)
- `toughness`: Defense (creatures)
- `energy_cost`: Energy cost (0-10)
- `abilities`: JSONB abilities
- `effect`: JSONB effect data
- `can_attack`: Boolean flag
- `created_at`, `updated_at`: Timestamps

#### `decks`
- `id`: Primary key
- `player_id`: Owner reference
- `name`: Deck name
- `is_active`: Active deck flag
- `card_count`: Total cards
- `type`: Deck type enum
- `created_at`, `updated_at`: Timestamps

#### `deck_cards`
- `id`: Primary key
- `deck_id`: Deck reference
- `card_id`: Card reference
- `created_at`: Timestamp

#### `game_rooms`
- `id`: Primary key
- `name`: Room name
- `status`: Room status (waiting, active, finished)
- `max_players`: Maximum players
- `created_at`, `updated_at`: Timestamps

#### `game_room_players`
- `id`: Primary key
- `room_id`: Room reference
- `player_id`: Player reference
- `deck_id`: Selected deck
- `is_ready`: Ready status
- `created_at`: Timestamp

#### `game_sessions`
- `id`: Primary key
- `room_id`: Source room
- `status`: Session status
- `started_at`: Start timestamp
- `ended_at`: End timestamp (nullable)
- `winner_id`: Winner reference (nullable)
- `created_at`, `updated_at`: Timestamps

#### `games`
- `id`: Primary key
- `player1_id`: First player
- `player2_id`: Second player
- `current_turn`: Turn number
- `current_player_id`: Active player
- `phase`: Current phase
- `status`: Game status
- `created_at`, `updated_at`: Timestamps

#### `game_players`
- `id`: Primary key
- `game_id`: Game reference
- `player_id`: Player reference
- `player_index`: Turn order
- `deck_id`: Used deck
- `health`: Player health
- `energy`: Current energy
- `max_energy`: Maximum energy
- `created_at`, `updated_at`: Timestamps

#### `game_cards`
- `id`: Primary key
- `game_id`: Game reference
- `card_id`: Card reference
- `player_id`: Owner
- `zone`: Card zone enum
- `position`: Position in zone
- `tapped`: Tapped state (future)
- `created_at`, `updated_at`: Timestamps

#### `game_actions`
- `id`: Primary key
- `game_id`: Game reference
- `player_id`: Action player
- `action_type`: Action type enum
- `action_data`: JSONB action data
- `turn_number`: Turn when executed
- `phase`: Phase when executed
- `step`: Step when executed
- `created_at`: Timestamp

#### `game_state_snapshots`
- `id`: Primary key
- `game_id`: Game reference
- `turn_number`: Turn number
- `phase`: Phase
- `state_data`: JSONB state data
- `created_at`: Timestamp

#### `card_counters`
- `id`: Primary key
- `game_id`: Game reference
- `card_id`: Card reference
- `counter_type`: Counter type
- `amount`: Counter amount
- `created_at`, `updated_at`: Timestamps

#### `triggered_abilities`
- `id`: Primary key
- `game_id`: Game reference
- `card_id`: Card reference
- `trigger_type`: Trigger type
- `effect_data`: JSONB effect data
- `is_resolved`: Resolution status
- `created_at`, `updated_at`: Timestamps

### Enums

**Card Types**: `creature`, `spell`, `enchantment`, `artifact`

**Rarities**: `common`, `uncommon`, `rare`, `mythic`

**Card Zones**: `library`, `hand`, `battlefield`, `graveyard`, `exile`, `stack`

**Deck Types**: `starter`, `custom`

### Relations

- `players` → `decks` (one-to-many)
- `decks` → `deck_cards` → `cards` (many-to-many)
- `game_rooms` → `game_room_players` → `players` (many-to-many)
- `game_sessions` → `games` (one-to-one)
- `games` → `game_players` → `players` (many-to-many)
- `games` → `game_cards` → `cards` (many-to-many)
- `games` → `game_actions` (one-to-many)
- `games` → `game_state_snapshots` (one-to-many)

---

## API Structure

### Base URL
- Development: `http://localhost:3001`
- Production: (configured via env)

### Endpoints

#### Authentication (`/auth`)

**POST `/auth/signup`**
- Register new player
- Body: `{ username, email }`
- Response: `{ success, player, message }`

**POST `/auth/signin`**
- Sign in existing player
- Body: `{ email }`
- Response: `{ success, player, message }`

**GET `/auth/profile`**
- Get player profile
- Query: `email`
- Response: `{ success, player }`

#### Cards (`/cards`)

**GET `/cards`**
- List all cards
- Query params: filters (future)
- Response: `{ success, cards }`

**GET `/cards/:id`**
- Get card by ID
- Response: `{ success, card }`

#### Decks (`/decks`)

**GET `/decks`**
- List player decks
- Query: `playerId`
- Response: `{ success, decks }`

**POST `/decks`**
- Create new deck
- Body: `{ playerId, name, cardIds }`
- Response: `{ success, deck }`

**GET `/decks/:id`**
- Get deck by ID
- Response: `{ success, deck }`

**PUT `/decks/:id`**
- Update deck
- Body: `{ name, cardIds }`
- Response: `{ success, deck }`

**DELETE `/decks/:id`**
- Delete deck
- Response: `{ success, message }`

#### Game Rooms (`/game-rooms`)

**GET `/game-rooms`**
- List game rooms
- Query: `status`
- Response: `{ success, rooms }`

**POST `/game-rooms`**
- Create game room
- Body: `{ name, maxPlayers }`
- Response: `{ success, room }`

**GET `/game-rooms/:id`**
- Get room details
- Response: `{ success, room }`

**POST `/game-rooms/:id/join`**
- Join room
- Body: `{ playerId, deckId }`
- Response: `{ success, message }`

**POST `/game-rooms/:id/leave`**
- Leave room
- Body: `{ playerId }`
- Response: `{ success, message }`

#### Game Sessions (`/game-sessions`)

**POST `/game-sessions/start`**
- Start game from room
- Body: `{ roomId }`
- Response: `{ success, gameSession }`

**GET `/game-sessions/:id/state`**
- Get game state
- Response: `{ success, gameState }`

**POST `/game-sessions/:id/actions`**
- Process game action
- Body: `{ type, data }`
- Response: `{ success, message }`

**POST `/game-sessions/:id/end`**
- End game session
- Body: `{ winnerId }`
- Response: `{ success, message }`

#### Players (`/players`)

**GET `/players`**
- List players
- Query: filters (future)
- Response: `{ success, players }`

**GET `/players/:id`**
- Get player by ID
- Response: `{ success, player }`

### OpenAPI Documentation

**GET `/doc`**: OpenAPI JSON specification

**GET `/reference`**: Interactive API documentation (Scalar UI)

---

## WebSocket System

### Architecture

**WebSocket Server**: `src/lib/websocket/websocket-server.ts`
- Port: `8081` (configurable)
- Event-driven message handling
- Room-based connections

**Socket Manager**: `src/lib/websocket/game-room-socket.ts`
- Manages room connections
- Player ready status
- Chat messages
- Room broadcasts

**Game Socket Manager**: `src/lib/websocket/game-socket-manager.ts`
- Bridges game events to WebSocket
- Maps game sessions to rooms
- Broadcasts game state updates

### Message Types

**Client → Server**:

```typescript
{
  type: 'join_room',
  roomId: number,
  playerId: number
}

{
  type: 'ready_status',
  isReady: boolean
}

{
  type: 'chat_message',
  message: string
}

{
  type: 'leave_room'
}
```

**Server → Client**:

```typescript
{
  type: 'connected',
  data: { roomId, playerId, socketId },
  timestamp: Date
}

{
  type: 'player_joined',
  data: { playerId, roomId },
  timestamp: Date
}

{
  type: 'player_left',
  data: { playerId, roomId },
  timestamp: Date
}

{
  type: 'ready_status_updated',
  data: { playerId, isReady },
  timestamp: Date
}

{
  type: 'chat_message',
  data: { playerId, message },
  timestamp: Date
}

{
  type: 'error',
  data: { message: string },
  timestamp: Date
}

// Game events (from game engine)
{
  type: 'game_started',
  data: { gameId, players },
  timestamp: Date
}

{
  type: 'game_state_updated',
  data: { gameId, currentTurn, phase },
  timestamp: Date
}
```

### Connection Flow

1. Client connects to WebSocket server
2. Client sends `join_room` message
3. Server adds client to room
4. Server broadcasts `player_joined` to room
5. Client can send `ready_status`, `chat_message`
6. On game start, game events broadcast to room
7. Client sends `leave_room` or disconnects

### Event Integration

Game engine emits events → `GameEventEmitter` → `GameSocketManager` → WebSocket broadcast

**Observer Pattern Flow**:
```
GameEngine.processAction()
  → gameEventEmitter.emit()
    → GameSocketManager (listener)
      → gameRoomSocketManager.broadcastToRoom()
        → WebSocket.send()
```

---

## Testing Strategy

### Test Framework

**Bun Test Runner**:
- Built-in test runner
- Fast execution
- TypeScript support

### Test Types

**Unit Tests**:
- Individual functions
- Strategy pattern implementations
- Utility functions

**Integration Tests**:
- API endpoints
- Database operations
- WebSocket communication

**Test Files**:
- `tests/websocket.test.ts`
- `tests/game-sessions.test.ts`
- `tests/players.test.ts`
- `tests/game-rooms.test.ts`
- `tests/decks.test.ts`
- `tests/type-safe-system.test.ts`

### Test Setup

**Testcontainers**:
- Isolated PostgreSQL instances
- Automatic cleanup
- No manual database setup

**Test Database**:
```typescript
beforeAll(async () => {
  await initializeTestDatabase();
});

afterAll(async () => {
  await cleanupTestDatabase();
});
```

### Test Commands

```bash
# Run all tests
bun test

# Watch mode
bun test:watch

# Coverage
bun test:coverage

# With testcontainers
USE_TESTCONTAINERS=true bun test
```

---

## Development Workflow

### Environment Setup

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Environment Variables**:
   Create `.env` file:
   ```env
   DATABASE_HOST=localhost
   DATABASE_NAME=simple_tcg
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_PORT=5432
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simple_tcg
   PORT=3001
   LOG_LEVEL=info
   NODE_ENV=development
   TEST_MODE=true
   ```

3. **Start Database**:
   ```bash
   bun run docker:up
   ```

4. **Run Migrations**:
   ```bash
   bun run migrate
   ```

5. **Start Development Server**:
   ```bash
   bun run dev
   ```

### Docker Workflow

**Start Services**:
```bash
bun run docker:up
```

**Stop Services**:
```bash
bun run docker:down
```

**View Logs**:
```bash
bun run docker:logs
```

**Clean Volumes**:
```bash
bun run docker:clean
```

### Database Migrations

**Generate Migration**:
```bash
bun run migration:generate
```

**Run Migrations**:
```bash
bun run migration:run
# or
bun run migrate
```

**Push Schema** (development only):
```bash
bun run schema:push
```

### Code Quality

**Linting**:
```bash
bun run lint
```

**Formatting**:
```bash
bun run format
```

**Format Check**:
```bash
bun run format:check
```

### Building

**Production Build**:
```bash
bun run build
```

**Start Production**:
```bash
bun run start
```

### API Documentation

**View Documentation**:
- OpenAPI JSON: `http://localhost:3001/doc`
- Interactive UI: `http://localhost:3001/reference`

---

## Additional Notes

### Type Safety

The entire codebase is built with TypeScript strict mode, ensuring:
- No implicit `any` types
- Strict null checks
- Type inference from Drizzle schemas
- Runtime validation with Zod

### Performance Considerations

- **Connection Pooling**: PostgreSQL connection pool for efficient database access
- **In-Memory State**: Game state cached in memory for fast access
- **Event-Driven**: Observer pattern reduces polling
- **WebSocket**: Real-time updates without HTTP overhead

### Security

- **Input Validation**: All inputs validated with Zod
- **SQL Injection**: Prevented by Drizzle ORM
- **Environment Variables**: Sensitive data in env, validated on startup
- **Email Validation**: Email format validation

### Scalability

**Current Architecture**:
- Single server instance
- In-memory game state
- WebSocket on same server

**Future Considerations**:
- Horizontal scaling with Redis for state
- WebSocket server separation
- Database read replicas
- Caching layer

### Extensibility

The codebase is designed for easy extension:
- **New Card Types**: Add to enum and factory
- **New Abilities**: Add to ability registry
- **New Strategies**: Implement interface and register
- **New Events**: Add to event types and emit
- **New Modules**: Follow existing module structure

---

## Conclusion

This API server is built with modern best practices, focusing on:
- **Type Safety**: TypeScript + Zod + Drizzle
- **Design Patterns**: Factory, Strategy, Observer
- **Code Quality**: ESLint, Prettier, strict TypeScript
- **Testing**: Testcontainers for integration tests
- **Documentation**: OpenAPI with interactive UI
- **Real-time**: WebSocket for game updates
- **Maintainability**: Modular architecture, clear separation of concerns

The architecture supports a trading card game with:
- Player management
- Card and deck systems
- Game rooms and sessions
- Turn-based gameplay
- Real-time updates
- Event-driven mechanics

