# Starter Deck Templates

## 1. Mono-Fire (Red) Aggro Deck - "Blazing Onslaught"
**Strategy:** Fast-paced aggressive play with direct damage
**Difficulty:** Beginner
**Theme:** Quick damage and board control

### Deck Composition (30 cards)

#### Creatures (12 cards)
- 3x Flame Imp (Common)
  - Power: 2, Health: 1
  - Cost: {F} (1 Fire)
  - Effect: When played, deal 2 damage to target player

- 2x Fire Elemental (Uncommon)
  - Power: 3, Health: 3
  - Cost: {F}{F} (2 Fire)
  - Effect: When played, deal 1 damage to all creatures

- 1x Dragon Hatchling (Rare)
  - Power: 1, Health: 1
  - Cost: {F} (1 Fire)
  - Effect: At the start of your turn, gain +1/+1

#### Spells (12 cards)
- 3x Fireball (Common)
  - Cost: {F}{2} (1 Fire + 2 Generic)
  - Effect: Deal 3 damage to target creature or player

- 2x Flame Shield (Uncommon)
  - Cost: {F}{1} (1 Fire + 1 Generic)
  - Effect: Give target creature +2/+0 and "Deal 1 damage to attacker when blocked"

- 1x Inferno (Epic)
  - Cost: {F}{F}{2} (2 Fire + 2 Generic)
  - Effect: Deal 5 damage to all creatures and players

#### Enchantments (3 cards)
- 1x Eternal Flame (Rare)
  - Cost: {F}{2} (1 Fire + 2 Generic)
  - Effect: At the start of your turn, deal 1 damage to each player

#### Artifacts (3 cards)
- 2x Flame Sword (Uncommon)
  - Cost: {F}{1} (1 Fire + 1 Generic)
  - Effect: Equipped creature gets +2/+0 and deals 1 damage to target creature when it attacks

- 1x Elemental Fusion (Epic)
  - Cost: {F}{F}{1} (2 Fire + 1 Generic)
  - Effect: Combine two creatures into one with combined power and health

## 2. Mono-Wind (Green) Ramp Deck - "Storm Surge"
**Strategy:** Resource acceleration and big creatures
**Difficulty:** Beginner
**Theme:** Mana generation and powerful creatures

### Deck Composition (30 cards)

#### Creatures (12 cards)
- 3x Wind Sprite (Common)
  - Power: 1, Health: 1
  - Cost: {W} (1 Wind)
  - Effect: Can't be blocked by creatures with power 3 or greater

- 2x Storm Caller (Uncommon)
  - Power: 2, Health: 2
  - Cost: {W}{1} (1 Wind + 1 Generic)
  - Effect: When played, draw a card

- 1x Thunder Bird (Rare)
  - Power: 3, Health: 2
  - Cost: {W}{W} (2 Wind)
  - Effect: Can attack twice each turn

#### Spells (12 cards)
- 3x Gust (Common)
  - Cost: {W} (1 Wind)
  - Effect: Return target creature to the top of its owner's library

- 2x Wind Walk (Uncommon)
  - Cost: {W}{1} (1 Wind + 1 Generic)
  - Effect: Target creature can't be blocked this turn

- 1x Cyclone (Rare)
  - Cost: {W}{W}{1} (2 Wind + 1 Generic)
  - Effect: Shuffle all creatures into their owners' libraries

#### Enchantments (3 cards)
- 1x Wind's Guidance (Rare)
  - Cost: {W}{2} (1 Wind + 2 Generic)
  - Effect: Draw an additional card each turn

#### Artifacts (3 cards)
- 2x Wind Boots (Uncommon)
  - Cost: {W}{1} (1 Wind + 1 Generic)
  - Effect: Equipped creature can't be blocked

- 1x Elemental Nexus (Epic)
  - Cost: {W}{W}{1} (2 Wind + 1 Generic)
  - Effect: Your spells cost 1 less to cast

## Deck Characteristics

### Mono-Fire (Red) Deck
- **Mana Curve:**
  - 1 Mana: 8 cards
  - 2 Mana: 12 cards
  - 3 Mana: 6 cards
  - 4 Mana: 4 cards

- **Key Strategies:**
  - Early game pressure with Flame Imp
  - Direct damage with Fireball
  - Board control with Fire Elemental
  - Late game with Dragon Hatchling

### Mono-Wind (Green) Deck
- **Mana Curve:**
  - 1 Mana: 6 cards
  - 2 Mana: 12 cards
  - 3 Mana: 8 cards
  - 4 Mana: 4 cards

- **Key Strategies:**
  - Card advantage with Storm Caller
  - Evasion with Wind Sprite
  - Multiple attacks with Thunder Bird
  - Cost reduction with Elemental Nexus

## Database Implementation

```sql
-- Insert starter decks
INSERT INTO starter_decks (name, description, strategy_type, difficulty_level)
VALUES 
    ('Blazing Onslaught', 'Fast-paced aggressive play with direct damage', 'aggro', 'beginner'),
    ('Storm Surge', 'Resource acceleration and big creatures', 'ramp', 'beginner');

-- Insert deck cards (example for Fire deck)
INSERT INTO starter_deck_cards (starter_deck_id, card_id, quantity)
VALUES 
    (1, 1, 3),  -- 3x Flame Imp
    (1, 2, 2),  -- 2x Fire Elemental
    (1, 3, 1);  -- 1x Dragon Hatchling
```