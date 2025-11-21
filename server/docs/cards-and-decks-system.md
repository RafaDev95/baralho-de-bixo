# Cards and Decks System - Technical Guide

## Overview
The Cards and Decks system is the foundation of the Baralho de bixo backend, providing the infrastructure for card management, deck building, and card gameplay mechanics. This system handles everything from individual card properties to complex deck collections and card interactions.

## Architecture

### Core Components
1. **Card Factory System** - Dynamic card creation with strategy patterns
2. **Database Schema** - PostgreSQL tables for cards, decks, and relationships
3. **API Layer** - RESTful endpoints for card and deck management
4. **Validation Layer** - Zod schemas for data integrity
5. **Business Logic** - Handlers for complex operations

### Data Flow
```
Client Request → API Route → Handler → Database → Response
                    ↓
              Validation (Zod) → Business Logic
```

## Database Schema

### Cards Table (`cards`)
```sql
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('creature', 'spell', 'enchantment', 'artifact')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'mythic')),
  description TEXT NOT NULL,
  power INTEGER, -- For creatures
  toughness INTEGER, -- For creatures
  energy_cost INTEGER NOT NULL DEFAULT 0, -- Simple energy cost (0-10)
  abilities JSONB, -- Card abilities
  effect JSONB, -- Card effects
  can_attack BOOLEAN DEFAULT true,
  can_block BOOLEAN DEFAULT true,
  has_summoning_sickness BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Decks Table (`decks`)
```sql
CREATE TABLE decks (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT false,
  card_count INTEGER NOT NULL DEFAULT 0,
  type INTEGER NOT NULL, -- 1: starter, 2: custom
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Deck Cards Table (`deck_cards`)
```sql
CREATE TABLE deck_cards (
  id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Card Factory System

### Overview
The Card Factory system uses the Strategy pattern to create different types of cards dynamically. This allows for flexible card creation without modifying the core card creation logic.

### Factory Structure
```
CardFactory
├── BaseCardStrategy (abstract)
├── CreatureCardStrategy
├── SpellCardStrategy
├── EnchantmentCardStrategy
└── ArtifactCardStrategy
```

### Strategy Interface
```typescript
interface BaseCardStrategy {
  createCard(data: CreateCardData): Promise<Card>;
  validateCardData(data: CreateCardData): boolean;
  getDefaultProperties(): Partial<Card>;
}
```

### Usage Example
```typescript
// Create a creature card
const creatureStrategy = new CreatureCardStrategy();
const card = await creatureStrategy.createCard({
  name: 'Dragon',
  type: 'creature',
  power: 5,
  toughness: 5,
  manaCost: { red: 2, generic: 3 },
  // ... other properties
});
```

## API Endpoints

### Cards API

#### GET `/cards`
**Purpose**: Retrieve all cards with optional filtering
**Query Parameters**:
- `type`: Filter by card type
- `rarity`: Filter by rarity
- `colors`: Filter by colors (comma-separated)
- `page`: Pagination page number
- `limit`: Items per page

**Response**:
```json
{
  "cards": [
    {
      "id": 1,
      "name": "Fireball",
      "type": "spell",
      "rarity": "common",
      "manaCost": { "red": 1, "generic": 2 },
      "power": null,
      "toughness": null,
      "colors": ["red"],
      "description": "Deal 3 damage to target creature or player"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### POST `/cards`
**Purpose**: Create a new card
**Request Body**:
```json
{
  "name": "Lightning Bolt",
  "type": "spell",
  "rarity": "common",
  "description": "Deal 3 damage to any target",
  "colors": ["red"],
  "manaCost": { "red": 1 },
  "effect": {
    "type": "damage",
    "amount": 3,
    "targets": ["creature", "player"]
  }
}
```

**Validation Rules**:
- `name`: Required, 1-100 characters
- `type`: Must be valid card type
- `manaCost`: Must be valid mana cost object
- `colors`: Must be array of valid colors
- `power/toughness`: Required for creatures

#### GET `/cards/:id`
**Purpose**: Get detailed information about a specific card
**Response**: Full card object with all properties

#### PUT `/cards/:id`
**Purpose**: Update an existing card
**Request Body**: Partial card data (only fields to update)

#### DELETE `/cards/:id`
**Purpose**: Delete a card (soft delete in future versions)

### Decks API

#### GET `/decks`
**Purpose**: Get player's decks
**Query Parameters**:
- `playerId`: Filter by player (required)
- `type`: Filter by deck type
- `isActive`: Filter by active status

**Response**:
```json
{
  "decks": [
    {
      "id": 1,
      "name": "Red Aggro",
      "type": 2,
      "cardCount": 60,
      "isActive": true,
      "playerId": 123,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/decks`
**Purpose**: Create a new deck
**Request Body**:
```json
{
  "name": "Blue Control",
  "playerId": 123,
  "type": 2,
  "cards": [1, 2, 3, 4, 5] // Array of card IDs
}
```

**Validation Rules**:
- `name`: Required, 1-255 characters
- `playerId`: Must be valid player ID
- `cards`: Must be valid card IDs, minimum 60 cards
- `type`: Must be valid deck type

#### PUT `/decks/:id`
**Purpose**: Update deck properties or card composition
**Request Body**: Partial deck data or card array

#### DELETE `/decks/:id`
**Purpose**: Delete a deck and all its card associations

#### GET `/decks/:id/cards`
**Purpose**: Get all cards in a specific deck
**Response**: Array of card objects with deck-specific metadata

## Card Properties and Types

### Card Types

#### Creature Cards
- **Properties**: `power`, `toughness`, `canAttack`, `canBlock`, `hasSummoningSickness`
- **Behavior**: Can attack, block, have combat stats
- **Special Rules**: Summoning sickness, combat mechanics

#### Spell Cards
- **Properties**: `effect`, `manaCost`
- **Behavior**: One-time effects, instant or sorcery speed
- **Special Rules**: Stack resolution, timing restrictions

#### Enchantment Cards
- **Properties**: `effect`, `abilities`
- **Behavior**: Ongoing effects, permanent on battlefield
- **Special Rules**: Aura attachments, global effects

#### Artifact Cards
- **Properties**: `effect`, `abilities`
- **Behavior**: Non-creature permanents, equipment
- **Special Rules**: Equipment, artifact abilities

### Mana System Integration

#### Mana Cost Structure
```typescript
interface ManaCost {
  red?: number;
  blue?: number;
  green?: number;
  white?: number;
  black?: number;
  generic?: number;
}
```

#### Examples
```json
{
  "red": 1,           // 1 red mana
  "generic": 2,       // 2 generic mana
  "blue": 2,          // 2 blue mana
  "white": 1,         // 1 white mana
  "generic": 1        // 1 generic mana
}
```

### Color Identity
- **Single Color**: `["red"]`
- **Multi-Color**: `["red", "blue"]`
- **Colorless**: `["colorless"]`
- **Hybrid**: `["red", "blue"]` (can be paid with either)

## Deck Management

### Deck Building Rules
1. **Minimum Size**: 60 cards
2. **Maximum Size**: No upper limit (practical limits apply)
3. **Card Copies**: Maximum 4 copies of any card (except basic lands)
4. **Color Identity**: Must match deck's color identity

### Deck Types
1. **Starter Decks** (type: 1): Pre-built, new player friendly
2. **Custom Decks** (type: 2): Player-constructed, tournament legal

### Deck Validation
```typescript
interface DeckValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  cardCount: number;
  colorIdentity: string[];
  manaCurve: ManaCurve;
}
```

## Business Logic

### Card Creation Flow
1. **Validation**: Check input data against Zod schemas
2. **Strategy Selection**: Choose appropriate card strategy
3. **Property Assignment**: Set default values and validate
4. **Database Insert**: Create card record
5. **Response**: Return created card with ID

### Deck Creation Flow
1. **Validation**: Check deck requirements and card validity
2. **Card Verification**: Ensure all cards exist and are valid
3. **Deck Creation**: Create deck record
4. **Card Association**: Link cards to deck
5. **Count Update**: Update deck card count
6. **Response**: Return deck with card list

### Card Search and Filtering
1. **Query Building**: Construct database queries based on filters
2. **Pagination**: Handle large result sets efficiently
3. **Sorting**: Order results by relevance, name, cost, etc.
4. **Caching**: Cache frequently accessed card data

## Error Handling

### Common Error Types
- **Validation Errors**: Invalid input data
- **Database Errors**: Connection, constraint violations
- **Business Logic Errors**: Invalid card combinations, deck rules
- **Authentication Errors**: Unauthorized access

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid mana cost format",
    "details": {
      "field": "manaCost",
      "value": "invalid",
      "expected": "object with mana type keys"
    }
  }
}
```

## Performance Considerations

### Database Optimization
- **Indexes**: On `type`, `rarity`, `colors`, `manaCost`
- **Query Optimization**: Efficient joins and filtering
- **Connection Pooling**: Manage database connections

### Caching Strategy
- **Card Cache**: Frequently accessed card data
- **Deck Cache**: Player deck lists
- **Search Cache**: Common search results

### Pagination
- **Cursor-based**: For large datasets
- **Offset-based**: For simple pagination
- **Efficient Queries**: Avoid COUNT(*) on large tables

## Testing Strategy

### Unit Tests
- **Card Factory**: Test each strategy independently
- **Validation**: Test Zod schemas and business rules
- **Handlers**: Test API logic without database

### Integration Tests
- **Database Operations**: Test CRUD operations
- **API Endpoints**: Test full request/response cycle
- **Error Scenarios**: Test edge cases and failures

### Test Data
- **Fixtures**: Pre-defined test cards and decks
- **Factories**: Generate test data programmatically
- **Cleanup**: Automatic test data cleanup

## Security Considerations

### Input Validation
- **SQL Injection**: Prevented by ORM
- **XSS**: Sanitize user input
- **Rate Limiting**: Prevent abuse

### Access Control
- **Authentication**: JWT token validation
- **Authorization**: Player can only modify own decks
- **Resource Isolation**: Players cannot access other players' data

### Data Integrity
- **Constraints**: Database-level validation
- **Transactions**: Atomic operations
- **Audit Trail**: Track changes and deletions

## Future Enhancements

### Short Term
- **Card Images**: Support for card artwork
- **Advanced Search**: Full-text search, filters
- **Deck Sharing**: Public/private deck visibility

### Medium Term
- **Card Formats**: Standard, modern, legacy support
- **Deck Analytics**: Win rates, performance metrics
- **Card Recommendations**: AI-powered suggestions

### Long Term
- **Card Market**: Trading and selling
- **Community Features**: Deck ratings, comments
- **Mobile App**: Native mobile support

## Integration Points

### Game Engine
- **Card Loading**: Load cards into game sessions
- **Deck Validation**: Ensure deck legality before games
- **State Management**: Track cards in play

### WebSocket System
- **Real-time Updates**: Notify clients of card/deck changes
- **Live Deck Building**: Collaborative deck construction
- **Game Events**: Card play notifications

### Authentication System
- **Player Ownership**: Link cards and decks to players
- **Permission Checks**: Validate access rights
- **Audit Logging**: Track player actions

---

*This document provides a comprehensive overview of the Cards and Decks system. For implementation details, refer to the source code and API documentation.*
