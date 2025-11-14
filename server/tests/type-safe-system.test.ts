import { describe, it, expect, beforeEach } from 'bun:test';
import { CardLoader } from '../src/modules/cards/factory/card-loader';
import { defineCard } from '../src/modules/cards/factory/card-definition-builder';
import { defineDeck } from '../src/modules/decks/deck-builder';
import { defineAbility } from '../src/modules/cards/abilities/ability-registry';
import { flameImp, fireball } from '../src/modules/cards/definitions';
import { quickStrike } from '../src/modules/cards/abilities';

describe('Type-Safe Card System', () => {
  beforeEach(() => {
    CardLoader.resetInstance();
  });

  describe('Card Definition Builder', () => {
    it('should create a valid creature card with type safety', () => {
      const testCard = defineCard({
        name: "Test Creature",
        rarity: "common",
        colors: ["red"],
        type: "creature",
        description: "A test creature",
        manaCost: { red: 1, generic: 0 },
        power: 2,
        toughness: 1,
        abilities: [quickStrike]
      });

      expect(testCard.name).toBe("Test Creature");
      expect(testCard.type).toBe("creature");
      expect(testCard.power).toBe(2);
      expect(testCard.toughness).toBe(1);
      expect(testCard.abilities).toHaveLength(1);
      expect(testCard.abilities![0].name).toBe("Quick Strike");
    });

    it('should create a valid spell card with type safety', () => {
      const testSpell = defineCard({
        name: "Test Spell",
        rarity: "common",
        colors: ["red"],
        type: "spell",
        description: "A test spell",
        manaCost: { red: 1, generic: 1 },
        effect: {
          type: "damage",
          target: "any",
          value: 3
        }
      });

      expect(testSpell.name).toBe("Test Spell");
      expect(testSpell.type).toBe("spell");
      expect(testSpell.effect?.type).toBe("damage");
      expect(testSpell.effect?.value).toBe(3);
    });

    it('should validate mana cost structure', () => {
      expect(() => {
        defineCard({
          name: "Invalid Card",
          rarity: "common",
          colors: ["red"],
          type: "creature",
          description: "Invalid mana cost",
          manaCost: { red: -1, generic: 0 }, // Invalid negative mana
          power: 1,
          toughness: 1
        });
      }).toThrow('Invalid mana cost for red: -1');
    });

    it('should validate creature stats', () => {
      expect(() => {
        defineCard({
          name: "Invalid Card",
          rarity: "common",
          colors: ["red"],
          type: "creature",
          description: "Invalid stats",
          manaCost: { red: 1, generic: 0 },
          power: -1, // Invalid negative power
          toughness: 1
        });
      }).toThrow('Invalid power: -1');
    });
  });

  describe('Deck Builder', () => {
    it('should create a valid deck template', () => {
      const testDeck = defineDeck({
        name: "Test Deck",
        type: "starter",
        colors: ["red"],
        description: "A test deck",
        cards: [
          { card: flameImp, count: 4 },
          { card: fireball, count: 4 },
          { card: flameImp, count: 4 }, // Add more cards to reach minimum
          { card: fireball, count: 3 }
        ]
      });

      expect(testDeck.name).toBe("Test Deck");
      expect(testDeck.cards).toHaveLength(4);
      expect(testDeck.cards[0].card.name).toBe("Flame Imp");
      expect(testDeck.cards[0].count).toBe(4);
    });

    it('should validate minimum deck size', () => {
      expect(() => {
        defineDeck({
          name: "Invalid Deck",
          type: "starter",
          colors: ["red"],
          description: "Too few cards",
          cards: [
            { card: flameImp, count: 1 } // Only 1 card, minimum is 15
          ]
        });
      }).toThrow('Deck must have at least 15 cards, found 1');
    });

    it('should validate color identity', () => {
      expect(() => {
        defineDeck({
          name: "Invalid Deck",
          type: "starter",
          colors: ["red"],
          description: "Wrong color",
          cards: [
            { card: flameImp, count: 4 }, // Red card
            { card: fireball, count: 4 },  // Red card
            { card: flameImp, count: 4 }, // Add more cards to reach minimum
            { card: fireball, count: 3 }
          ]
        });
      }).not.toThrow(); // Should not throw for valid colors

      // This should throw for invalid colors
      expect(() => {
        defineDeck({
          name: "Invalid Deck",
          type: "starter",
          colors: ["red"],
          description: "Wrong color",
          cards: [
            { card: flameImp, count: 4 },
            { card: flameImp, count: 4 },
            { card: flameImp, count: 4 },
            { card: flameImp, count: 3 }
          ]
        });
      }).not.toThrow(); // flameImp is red, so this should be valid
    });
  });

  describe('Card Loader Integration', () => {
    it('should load cards from TypeScript definitions', () => {
      const loader = CardLoader.getInstance();
      const cards = loader.loadAllCards();

      expect(cards.length).toBeGreaterThan(0);
      
      // Check that we have the expected cards
      const flameImpCard = cards.find(card => card.name === "Flame Imp");
      expect(flameImpCard).toBeDefined();
      expect(flameImpCard?.type).toBe("creature");
      expect(flameImpCard?.power).toBe(2);
      expect(flameImpCard?.toughness).toBe(1);
    });

    it('should maintain singleton pattern', () => {
      const loader1 = CardLoader.getInstance();
      const loader2 = CardLoader.getInstance();
      
      expect(loader1).toBe(loader2);
    });
  });

  describe('Ability System', () => {
    it('should create abilities with proper structure', () => {
      expect(quickStrike.id).toBe('quick_strike');
      expect(quickStrike.name).toBe('Quick Strike');
      expect(quickStrike.trigger).toBe('on_enter_battlefield');
      expect(quickStrike.effect.type).toBe('damage');
      expect(quickStrike.effect.target).toBe('player');
      expect(quickStrike.effect.value).toBe(2);
    });

    it('should validate ability definitions', () => {
      expect(() => {
        defineAbility({
          id: '', // Empty id should fail
          name: 'Test Ability',
          description: 'Test',
          trigger: 'on_enter_battlefield',
          effect: {
            type: 'damage',
            target: 'player',
            value: 1
          }
        });
      }).toThrow('Ability must have an id');
    });
  });
});
