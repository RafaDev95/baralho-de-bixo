# Baralho de bixo - Backend Project Overview

## Project Description
Baralho de bixo is a Trading Card Game backend built with modern TypeScript technologies. The system provides a complete foundation for card game mechanics, player management, deck building, game rooms, and real-time gameplay.

## Technology Stack
- **Runtime**: Bun with TypeScript
- **Framework**: Hono (HTTP server)
- **Database**: PostgreSQL with Drizzle ORM
- **WebSocket**: Standalone WebSocket server using `ws` library
- **Validation**: Zod schemas
- **Testing**: Bun test runner with Testcontainers
- **Linting/Formatting**: Biome
- **API Documentation**: OpenAPI (Hono)

## Architecture Overview

### Core Components
1. **Database Layer** - PostgreSQL with Drizzle ORM
2. **HTTP API Layer** - Hono routes and handlers
3. **WebSocket Layer** - Real-time communication
4. **Game Engine** - Core game logic and state management
5. **Mana System** - Resource management for card gameplay

### Data Flow
```
Client → HTTP API → Business Logic → Database
   ↓
WebSocket → Real-time Events → Game State Updates
```

## System Components

### 1. Database Schema
- **Players**: User accounts and authentication
- **Cards**: Card definitions and properties
- **Decks**: Player deck collections
- **Game Rooms**: Multiplayer lobbies
- **Game Sessions**: Active game instances
- **Game State**: In-memory and persistent game data

### 2. API Modules
- **Authentication**: Player registration and login
- **Cards**: Card management and factory patterns
- **Decks**: Deck creation and management
- **Game Rooms**: Lobby system
- **Game Sessions**: Game lifecycle management
- **Players**: Player profile management

### 3. Real-time Communication
- **WebSocket Server**: Standalone WebSocket handling
- **Game Room Events**: Real-time lobby updates
- **Game Events**: In-game action broadcasting

### 4. Game Engine
- **Session Management**: Game creation and lifecycle
- **Turn Management**: Player turns and phases
- **Action Processing**: Card plays and game actions
- **State Persistence**: Database and memory state sync

## Development Status

### ✅ Completed Features
- Player authentication and management
- Card creation and management system
- Deck building and management
- Game room/lobby system
- WebSocket real-time communication
- Game session management
- Basic game engine
- Mana system implementation
- Comprehensive test coverage

### 🚧 In Progress
- Advanced game mechanics
- Card interaction system

### 📋 Planned Features
- Combat system
- Spell resolution
- Advanced card abilities
- Tournament system
- Leaderboards

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (for tests)

### Installation
```bash
cd server
bun install
```

### Database Setup
```bash
bun run migrate
```

### Running Tests
```bash
bun test
```

### Development Server
```bash
bun run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Player registration
- `POST /auth/login` - Player authentication

### Cards
- `GET /cards` - List all cards
- `POST /cards` - Create new card
- `GET /cards/:id` - Get card details

### Decks
- `GET /decks` - List player decks
- `POST /decks` - Create new deck
- `PUT /decks/:id` - Update deck
- `DELETE /decks/:id` - Delete deck

### Game Rooms
- `GET /game-rooms` - List available rooms
- `POST /game-rooms` - Create new room
- `POST /game-rooms/:id/join` - Join room
- `POST /game-rooms/:id/leave` - Leave room
- `POST /game-rooms/:id/ready` - Set ready status
- `POST /game-rooms/:id/start` - Start game

### Game Sessions
- `POST /game-sessions/start` - Start new game
- `GET /game-sessions/:id/state` - Get game state
- `POST /game-sessions/:id/action` - Process game action
- `POST /game-sessions/:id/end` - End game

## WebSocket Events

### Client to Server
- `join_room` - Join a game room
- `leave_room` - Leave a game room
- `ready_status` - Update ready status
- `chat_message` - Send chat message
- `game_action` - Perform game action

### Server to Client
- `player_joined` - Player joined room
- `player_left` - Player left room
- `ready_status_updated` - Ready status changed
- `game_started` - Game has started
- `game_state_update` - Game state changed
- `chat_message` - New chat message

## Database Schema Details

### Core Tables
- **players**: User accounts with wallet addresses
- **cards**: Card definitions with properties
- **decks**: Player deck collections
- **deck_cards**: Many-to-many relationship between decks and cards
- **game_rooms**: Multiplayer lobbies
- **game_room_players**: Players in rooms
- **game_sessions**: Active game instances
- **game_players**: Players in games
- **game_cards**: Cards in games
- **game_actions**: Game action history
- **game_state_snapshots**: Game state backups

### Key Relationships
- Players can have multiple decks
- Decks contain multiple cards
- Game rooms can have multiple players
- Game sessions track game state and actions
- Game cards represent cards in play

## Game Mechanics

### Mana System
- **Mana Types**: Red, Blue, Green, White, Black, Generic
- **Mana Sources**: Lands (stored as artifacts in current schema)
- **Mana Costs**: Colored and generic mana requirements
- **Mana Pool**: Available mana for casting spells

### Game Flow
1. **Setup**: Players join room, set ready status
2. **Game Start**: Room converts to game session
3. **Turn Structure**: Untap → Draw → Main → Combat → Main → End
4. **Action Processing**: Players take actions during their turn
5. **Game End**: Win condition met or game terminated

### Card Types
- **Creatures**: Can attack, block, have power/toughness
- **Spells**: One-time effects
- **Enchantments**: Ongoing effects
- **Artifacts**: Non-creature permanents (including lands)

## Testing Strategy

### Test Types
- **Unit Tests**: Individual component testing
- **Integration Tests**: Database and API testing
- **WebSocket Tests**: Real-time communication testing

### Test Database
- Uses Testcontainers for isolated PostgreSQL instances
- Automatic cleanup between test runs
- Real database testing (not mocks)

## Performance Considerations

### Database
- Efficient queries with proper indexing
- Transaction-based operations for consistency
- Connection pooling for scalability

### Memory Management
- Game state cached in memory for active games
- Database snapshots for persistence
- Automatic cleanup of finished games

### WebSocket
- Efficient event broadcasting
- Connection management and cleanup
- Rate limiting for game actions

## Security Features

### Authentication
- Secure password hashing
- JWT token-based sessions
- Wallet address verification

### Input Validation
- Zod schema validation for all inputs
- SQL injection prevention via ORM
- Rate limiting on critical endpoints

### Game Integrity
- Server-side game state validation
- Action verification before execution
- Anti-cheat measures in game logic

## Deployment Considerations

### Environment Variables
- Database connection strings
- JWT secrets
- WebSocket configuration
- API rate limits

### Scaling
- Horizontal scaling with load balancers
- Database read replicas
- WebSocket clustering support
- Redis for session management (future)

## Future Enhancements

### Short Term
- Enhanced card abilities system
- Combat mechanics
- Spell resolution engine

### Medium Term
- Tournament system
- Leaderboards and rankings
- Advanced deck building tools

### Long Term
- Mobile app support
- Social features
- Marketplace integration
- AI opponents

## Contributing

### Code Standards
- TypeScript strict mode
- Biome linting and formatting
- Comprehensive test coverage
- Clear documentation

### Development Workflow
1. Feature branch creation
2. Implementation with tests
3. Code review and linting
4. Integration testing
5. Documentation updates

## Troubleshooting

### Common Issues
- Database connection problems
- WebSocket connection drops
- Game state synchronization
- Test database setup

### Debug Tools
- Comprehensive logging
- Database query monitoring
- WebSocket event tracing
- Game state inspection endpoints

---

*This document is maintained as part of the Baralho de bixo project. For questions or contributions, please refer to the project repository.*
