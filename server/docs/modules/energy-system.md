# Energy System Module

## Overview

The Energy System manages player resources. Players use a single energy resource that increases each turn.

## Responsibilities

1. **Energy Management**: Track current and maximum energy
2. **Cost Validation**: Check if player can afford card costs
3. **Turn Progression**: Increase energy at start of each turn
4. **Cost Payment**: Deduct energy when playing cards

## Key Classes

### `EnergySystem`

Static utility class for energy management.

**Key Methods:**
- `getPlayerEnergy(gameId, playerId)`: Get current energy
- `canPlayCard(gameId, playerId, cardId)`: Check if card can be played
- `payEnergyCost(gameId, playerId, cost)`: Pay energy cost
- `startTurn(gameId, playerId)`: Start new turn (reset energy, increase max)
- `getCardEnergyCost(card)`: Get energy cost from card

## Energy Rules

1. **Starting Energy**: Players start with 1 energy
2. **Energy Gain**: +1 energy per turn (max 10)
3. **Energy Reset**: Energy resets to max at start of each turn
4. **Card Costs**: Cards cost 0-10 energy

## Design Benefits

### Energy System Features

- Single energy value (0-10)
- Simple integer comparison for validation
- Single database query per card play
- Efficient state management
- Straightforward client logic

### Performance Benefits

1. **Efficient Database Queries**: Single query per card play
2. **Simple State**: Single number for energy
3. **Fast Validation**: Integer comparison
4. **Small Payloads**: Minimal data to serialize/deserialize
5. **Simple Client Logic**: Easy energy display

## Example Usage

```typescript
// Check if player can play a card
const canPlay = await EnergySystem.canPlayCard(gameId, playerId, cardId);
if (!canPlay.canPlay) {
  console.log(canPlay.reason); // "Insufficient energy. Need 5, have 3"
}

// Pay energy cost
await EnergySystem.payEnergyCost(gameId, playerId, 5);

// Start new turn (gain energy)
await EnergySystem.startTurn(gameId, playerId);
// Energy increases from current max to new max (capped at 10)
```

## Integration

- **Game Engine**: Uses energy system for card validation and payment
- **Database**: Stores energy in `game_players` table
- **Events**: Emits `energy_changed` events via Observer pattern

