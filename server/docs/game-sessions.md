# Game Sessions Documentation

## Overview

The Game Sessions system manages actual gameplay instances created from ready game rooms. It handles the complete game lifecycle from creation to completion, including turn management, game state, and player actions.

## Architecture

### Core Components

1. **Game Engine** (`/lib/game/game-engine-simple.ts`)
   - Manages game sessions in memory
   - Handles turn progression and phase management
   - Processes game actions and validates moves
   - Maintains game state consistency

2. **Game Sessions API** (`/modules/game-sessions/`)
   - RESTful endpoints for game management
   - OpenAPI documentation for all routes
   - Handles HTTP requests and delegates to game engine

3. **Database Schema** (`/db/schemas/game-sessions.ts`)
   - `game_sessions` - Main game session data
   - `game_players` - Players in a specific game
   - `game_cards` - Cards in play during the game
   - `game_actions` - Log of all game actions
   - `game_state_snapshots` - Game state history

## Game Flow

### 1. Game Creation
```
Room Ready → Start Game → Initialize Decks → Draw Starting Hands → Begin Turn 1
```

### 2. Turn Structure
Each turn follows this phase sequence:
- **Untap** - Untap all tapped permanents
- **Upkeep** - Handle upkeep effects
- **Draw** - Draw a card
- **Main 1** - Play cards, activate abilities
- **Combat** - Declare attackers/blockers, resolve damage
- **Main 2** - Additional actions
- **End** - End of turn effects

### 3. Game Actions
Players can perform various actions:
- `play_card` - Play a card from hand
- `attack` - Attack with creatures
- `block` - Block attacking creatures
- `end_turn` - End current turn
- `concede` - Surrender the game

## API Endpoints

### Start Game
```http
POST /game-sessions/start
{
  "roomId": 123
}
```

### Get Game State
```http
GET /game-sessions/{gameId}/state
```

### Process Game Action
```http
POST /game-sessions/{gameId}/action
{
  "type": "end_turn",
  "data": {}
}
```

### End Game
```http
POST /game-sessions/{gameId}/end
{
  "winnerId": 456
}
```

### List Active Games
```http
GET /game-sessions/active
```

## Game State Management

### In-Memory State
- Game engine maintains active games in memory for performance
- Each game has a unique ID and state object
- State includes current turn, player index, phase, and step

### Database Persistence
- Game sessions are stored in the database
- All actions are logged for replay/analysis
- Game state snapshots are created for historical tracking

### State Transitions
- State changes are atomic and validated
- Invalid actions are rejected with appropriate error messages
- Game state is updated both in memory and database

## Player Management

### Starting Hands
- Each player draws 7 cards from their deck
- Deck size and hand size are tracked
- Mulligan system can be implemented later

### Life Totals
- Default starting life: 20
- Life changes are tracked in game actions
- Game ends when a player reaches 0 life

### Turn Order
- Players take turns in sequence
- Turn advances after each player completes their turn
- Turn number increments after a full round

## Card Management

### Zones
Cards can exist in different zones:
- `hand` - Cards in player's hand
- `deck` - Remaining cards in deck
- `battlefield` - Cards in play
- `graveyard` - Destroyed/discarded cards
- `exile` - Removed from game
- `stack` - Spells/abilities being cast

### Card Properties
- `power` and `toughness` for creatures
- `isTapped` - Whether card is tapped
- `isSummoningSick` - Can't attack first turn
- `damage` - Current damage on creature
- `counters` - Various game counters

## Error Handling

### Validation Errors
- Invalid game actions are rejected
- Game state validation prevents illegal moves
- Player turn validation ensures proper turn order

### Game State Errors
- Non-existent games return 404
- Invalid room states prevent game creation
- Insufficient players prevent game start

## Testing

### Test Coverage
- Game creation and initialization
- Turn progression and phase management
- Action validation and processing
- Error handling and edge cases

### Test Data
- Mock players, decks, and cards
- Various room configurations
- Different game states and scenarios

## Future Enhancements

### Planned Features
- Mulligan system for starting hands
- More complex card interactions
- Mana system and resource management
- Advanced combat mechanics
- Card effect resolution system

### Scalability Considerations
- Redis for game state storage
- WebSocket integration for real-time updates
- Game replay and analysis tools
- Tournament system integration

## Usage Examples

### Starting a Game
```typescript
import { gameEngine } from '@/lib/game/game-engine-simple';

// Start game from ready room
const gameSession = await gameEngine.createGameSession(roomId);
console.log(`Game ${gameSession.id} started!`);
```

### Processing Actions
```typescript
// End current player's turn
await gameEngine.processGameAction(gameId, {
  type: 'end_turn',
  playerId: currentPlayerId
});
```

### Getting Game State
```typescript
const gameState = gameEngine.getGameState(gameId);
console.log(`Turn ${gameState.currentTurn}, Player ${gameState.currentPlayerIndex}`);
```

## Security Considerations

### Player Validation
- Verify player ownership of actions
- Validate game state before processing actions
- Prevent unauthorized game modifications

### Data Integrity
- Use database transactions for state changes
- Validate all input data
- Log all game actions for audit trail

## Performance Notes

### Memory Usage
- Game state kept in memory for active games
- Consider cleanup for long-running games
- Monitor memory usage in production

### Database Operations
- Batch operations where possible
- Use appropriate indexes on game tables
- Consider read replicas for game state queries
