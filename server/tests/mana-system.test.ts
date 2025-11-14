import { cleanupTestDatabase, db } from '@/db/config';
import {
  cardsTable,
  deckCards,
  decksTable,
  gameCardsTable,
  gamePlayersTable,
  gameRoomPlayersTable,
  gameRoomsTable,
  gameSessionsTable,
  playersTable,
} from '@/db/schemas';
import {
  type ManaCost,
  type ManaPool,
  ManaSystem,
} from '@/lib/game/mana-system-simple';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { setupTestDatabase } from './utils/testSetup';

describe('ManaSystem', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  describe('Mana Pool Management', () => {
    it('should create an empty mana pool', () => {
      const pool = ManaSystem.createEmptyManaPool();

      expect(pool.red).toBe(0);
      expect(pool.blue).toBe(0);
      expect(pool.green).toBe(0);
      expect(pool.white).toBe(0);
      expect(pool.black).toBe(0);
      expect(pool.generic).toBe(0);
    });

    it('should add mana to a pool', () => {
      const pool = ManaSystem.createEmptyManaPool();
      const newPool = ManaSystem.addMana(pool, 'red', 3);

      expect(newPool.red).toBe(3);
      expect(newPool.blue).toBe(0);
      expect(newPool.green).toBe(0);
      expect(newPool.white).toBe(0);
      expect(newPool.black).toBe(0);
      expect(newPool.generic).toBe(0);
    });

    it('should remove mana from a pool', () => {
      const pool: ManaPool = {
        red: 5,
        blue: 2,
        green: 0,
        white: 0,
        black: 0,
        generic: 0,
      };

      const newPool = ManaSystem.removeMana(pool, 'red', 2);
      expect(newPool.red).toBe(3);

      const emptyPool = ManaSystem.removeMana(pool, 'blue', 5);
      expect(emptyPool.blue).toBe(0); // Should not go below 0
    });
  });

  describe('Mana Cost Validation', () => {
    it('should validate simple mana costs', () => {
      const pool: ManaPool = {
        red: 2,
        blue: 1,
        green: 0,
        white: 0,
        black: 0,
        generic: 0,
      };

      const cost: ManaCost = { red: 1, blue: 1 };
      expect(ManaSystem.canPayManaCost(pool, cost)).toBe(true);
    });

    it('should reject insufficient colored mana', () => {
      const pool: ManaPool = {
        red: 1,
        blue: 0,
        green: 0,
        white: 0,
        black: 0,
        generic: 0,
      };

      const cost: ManaCost = { red: 2 };
      expect(ManaSystem.canPayManaCost(pool, cost)).toBe(false);
    });

    it('should validate generic mana costs', () => {
      const pool: ManaPool = {
        red: 2,
        blue: 1,
        green: 0,
        white: 0,
        black: 0,
        generic: 0,
      };

      const cost: ManaCost = { red: 1, generic: 2 };
      expect(ManaSystem.canPayManaCost(pool, cost)).toBe(true);
    });

    it('should reject insufficient total mana', () => {
      const pool: ManaPool = {
        red: 1,
        blue: 1,
        green: 0,
        white: 0,
        black: 0,
        generic: 0,
      };

      const cost: ManaCost = { red: 1, blue: 1, generic: 1 };
      expect(ManaSystem.canPayManaCost(pool, cost)).toBe(false);
    });
  });

  describe('Mana Cost Payment', () => {
    it('should pay colored mana costs first', () => {
      const pool: ManaPool = {
        red: 2,
        blue: 1,
        green: 0,
        white: 0,
        black: 0,
        generic: 0,
      };

      const cost: ManaCost = { red: 1, blue: 1, generic: 1 };
      const result = ManaSystem.payManaCost(pool, cost);

      expect(result.newPool.red).toBe(1);
      expect(result.newPool.blue).toBe(0);
      expect(result.newPool.generic).toBe(0);
      expect(result.usedMana.red).toBe(1);
      expect(result.usedMana.blue).toBe(1);
      expect(result.usedMana.generic).toBe(1);
    });

    it('should use colored mana for generic costs', () => {
      const pool: ManaPool = {
        red: 3,
        blue: 2,
        green: 0,
        white: 0,
        black: 0,
        generic: 0,
      };

      const cost: ManaCost = { generic: 4 };
      const result = ManaSystem.payManaCost(pool, cost);

      expect(result.newPool.red).toBe(0);
      expect(result.newPool.blue).toBe(1);
      expect(result.usedMana.generic).toBe(4);
    });
  });

  describe('Mana Cost Parsing', () => {
    it('should parse valid mana cost data', () => {
      const manaCostData = {
        red: 2,
        blue: 1,
        generic: 3,
      };

      const cost = ManaSystem.parseManaCost(manaCostData);
      expect(cost.red).toBe(2);
      expect(cost.blue).toBe(1);
      expect(cost.generic).toBe(3);
      expect(cost.green).toBe(0);
      expect(cost.white).toBe(0);
      expect(cost.black).toBe(0);
    });

    it('should handle null/undefined mana cost data', () => {
      const cost1 = ManaSystem.parseManaCost(null);
      expect(cost1.generic).toBe(0);

      const cost2 = ManaSystem.parseManaCost(undefined);
      expect(cost2.generic).toBe(0);
    });

    it('should calculate total mana value', () => {
      const cost: ManaCost = { red: 2, blue: 1, generic: 3 };
      const total = ManaSystem.getTotalManaValue(cost);
      expect(total).toBe(6);
    });
  });

  describe('Land Mana Type Detection', () => {
    it('should detect basic land types', () => {
      expect(ManaSystem.getLandManaType('Mountain')).toBe('red');
      expect(ManaSystem.getLandManaType('Island')).toBe('blue');
      expect(ManaSystem.getLandManaType('Forest')).toBe('green');
      expect(ManaSystem.getLandManaType('Plains')).toBe('white');
      expect(ManaSystem.getLandManaType('Swamp')).toBe('black');
    });

    it('should handle unknown land types', () => {
      expect(ManaSystem.getLandManaType('Unknown Land')).toBe(null);
    });
  });

  describe('Integration Tests', () => {
    it('should validate card play with mana system', async () => {
      // Create test data
      const [player] = await db
        .insert(playersTable)
        .values({
          username: 'testplayer',
          email: 'test@example.com',
          walletAddress: '0x1234567890abcdef',
        })
        .returning();

      const [card] = await db
        .insert(cardsTable)
        .values({
          name: 'Test Spell',
          type: 'spell',
          rarity: 'common',
          colors: ['red'],
          manaCost: { red: 1, generic: 2 },
          power: 0,
          toughness: 0,
          description: 'A test spell',
        })
        .returning();

      const [deck] = await db
        .insert(decksTable)
        .values({
          name: 'Test Deck',
          playerId: player.id,
          type: 1, // 1 for custom deck type
        })
        .returning();

      await db.insert(deckCards).values({
        deckId: deck.id,
        cardId: card.id,
      });

      const [room] = await db
        .insert(gameRoomsTable)
        .values({
          name: 'Test Room',
          status: 'waiting',
          maxPlayers: 2,
          createdBy: player.id,
        })
        .returning();

      await db.insert(gameRoomPlayersTable).values({
        roomId: room.id,
        playerId: player.id,
        deckId: deck.id,
        isReady: 'ready',
      });

      // Create a game session
      const [gameSession] = await db
        .insert(gameSessionsTable)
        .values({
          roomId: room.id,
          status: 'active',
          startedAt: new Date(),
        })
        .returning();

      await db.insert(gamePlayersTable).values({
        gameId: gameSession.id,
        playerId: player.id,
        deckId: deck.id,
        playerIndex: 0,
        lifeTotal: 20,
      });

      // Add some lands to the battlefield
      const [mountain] = await db
        .insert(cardsTable)
        .values({
          name: 'Mountain',
          type: 'artifact',
          rarity: 'common',
          colors: ['red'],
          manaCost: {},
          power: 0,
          toughness: 0,
          description: 'A basic mountain',
        })
        .returning();

      const [island] = await db
        .insert(cardsTable)
        .values({
          name: 'Island',
          type: 'artifact',
          rarity: 'common',
          colors: ['blue'],
          manaCost: {},
          power: 0,
          toughness: 0,
          description: 'A basic island',
        })
        .returning();

      await db.insert(gameCardsTable).values([
        {
          gameId: gameSession.id,
          cardId: mountain.id,
          ownerId: player.id,
          controllerId: player.id,
          location: 'battlefield',
          zoneIndex: 0,
          power: 0,
          toughness: 0,
          isTapped: false,
        },
        {
          gameId: gameSession.id,
          cardId: island.id,
          ownerId: player.id,
          controllerId: player.id,
          location: 'battlefield',
          zoneIndex: 1,
          power: 0,
          toughness: 0,
          isTapped: false,
        },
      ]);

      // Test mana validation
      const canPlay = await ManaSystem.canPlayCard(
        gameSession.id,
        player.id,
        card.id
      );
      expect(canPlay.canPlay).toBe(true);

      // Test playing the card
      const playResult = await ManaSystem.playCard(
        gameSession.id,
        player.id,
        card.id
      );
      expect(playResult.success).toBe(true);
      expect(playResult.usedMana).toBeDefined();
    });
  });
});
