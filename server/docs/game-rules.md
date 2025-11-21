# Card Battle Game Rules

## Overview

This is a card battle game designed to run smoothly in the browser.

## Game Setup

1. **Players**: 2 players
2. **Starting Health**: 20 health points
3. **Starting Hand**: 5 cards
4. **Starting Energy**: 1 energy
5. **Deck Size**: 30 cards (recommended)

## Turn Structure

Each turn has 3 simple phases:

### 1. Draw Phase
- Draw 1 card from deck
- Gain +1 energy (max 10)
- Energy resets to maximum

### 2. Play Phase
- Play cards from hand (pay energy cost)
- Attack with creatures
- Use abilities

### 3. End Phase
- End turn
- Pass to opponent

## Energy System

- **Starting Energy**: 1 energy on turn 1
- **Energy Gain**: +1 energy per turn (max 10)
- **Energy Reset**: Energy resets to maximum at start of each turn
- **Card Costs**: Cards cost 0-10 energy

**Example:**
- Turn 1: 1 energy
- Turn 2: 2 energy
- Turn 3: 3 energy
- ...
- Turn 10+: 10 energy (capped)

## Card Types

### Creatures
- Have **power** (attack) and **toughness** (health)
- Can attack opponent directly
- No blocking - creatures attack opponent's health directly
- No summoning sickness - can attack immediately

### Spells
- Instant effects when played
- Examples: Deal damage, draw cards, heal

### Enchantments
- Ongoing effects on the battlefield
- Examples: "All creatures get +1 power"

### Artifacts
- Permanent cards with abilities
- Examples: "Gain 1 energy each turn"

## Combat

- **No Blocking**: Creatures attack opponent directly
- **Direct Damage**: Creature's power = damage to opponent
- **No Tapping**: Creatures don't tap to attack
- **Immediate Attack**: Creatures can attack the turn they're played

**Example:**
- Player plays a 5/5 creature
- Player attacks with it
- Opponent takes 5 damage (20 → 15 health)

## Winning the Game

Reduce opponent's health to 0 or below.

## Card Zones

Cards exist in 4 zones:

1. **Deck**: Cards not yet drawn
2. **Hand**: Cards you can play
3. **Battlefield**: Cards in play (creatures, enchantments, artifacts)
4. **Graveyard**: Destroyed/discarded cards

## Game Mechanics

### Core Features
- Card playing
- Creature combat
- Energy/resource management
- Spell effects
- Enchantments
- Turn-based gameplay

## Example Turn

**Turn 1:**
1. Draw 1 card (hand: 6 cards)
2. Gain 1 energy (now have 1 energy)
3. Play a 1-cost creature (0 energy remaining)
4. Attack with creature (opponent: 20 → 19 health)
5. End turn

**Turn 2:**
1. Draw 1 card (hand: 6 cards)
2. Gain 1 energy (now have 2 energy, max 2)
3. Play a 2-cost spell (0 energy remaining)
4. End turn

## Strategy Tips

1. **Energy Management**: Plan your turns around energy curve
2. **Early Game**: Play low-cost cards to establish board
3. **Mid Game**: Build up energy for powerful cards
4. **Late Game**: Use high-cost cards to finish opponent

## Technical Benefits

These rules enable:
- **Fast Gameplay**: Quick turns
- **Browser Performance**: Optimized state and calculations
- **Real-time Updates**: WebSocket push updates
- **Easy to Learn**: Clear mechanics

## Future Enhancements

While simplified, the game can be extended:
- More card types
- More abilities (using Strategy pattern)
- More complex effects
- Multiplayer support
- Tournament mode

The design patterns (Factory, Strategy, Observer) make it easy to add features without breaking existing code.

