import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { setupTestDatabase } from './utils/testSetup';

import { cleanupTestDatabase } from '@/db/config/drizzle.config';
import { CardLoader } from '@/modules/cards/factory/card-loader';
import { CardService } from '@/modules/cards/service';
import app from '@/server/app';

// bun test tests/decks.test.ts

describe('Deck Creation', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  }, 120000); // 2 minute timeout for testcontainers to start

  afterAll(async () => {
    await cleanupTestDatabase();
  }, 30000); // 30 second timeout for cleanup

  describe('Load all cards before tests', () => {
    it('should load all cards and save them to the database', async () => {
      const loadedCards = CardLoader.getInstance().loadAllCards();
      const cardService = new CardService();
      const result = await cardService.insertMany(loadedCards);

      expect(result.length).toBe(loadedCards.length);
    });
  });

  describe('POST /decks', () => {
    it('should create a new deck', async () => {
      const deckData = {
        name: 'Test Deck',
        type: 1,
        cardIds: Array.from({ length: 15 }, (_, i) => i + 1), // 15 card IDs
      };

      const res = await app.request('/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deckData),
      });

      const data = await res.json();

      expect(data.cards.length).toBe(15);

      expect(res.status).toBe(201);
      expect(data.id).toBeDefined();
    });
  });
});
