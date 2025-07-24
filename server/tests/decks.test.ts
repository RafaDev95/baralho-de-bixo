import { afterAll, beforeAll, describe, it } from 'vitest';
import { setupTestDatabase } from './utils/testSetup';

import { cleanupTestDatabase } from '@/db/config/drizzle.config';
import { CardLoader } from '@/modules/cards/factory/card-loader';
import { CardService } from '@/modules/cards/service';

describe('Deck Creation', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('Load all cards before tests', () => {
    it('should load all cards and save them to the database', async () => {
      const cards = CardLoader.getInstance().loadAllCards();
      const cardService = new CardService();
      const result = await cardService.insertMany(cards);

      console.log('result', result);
    });
  });

  // describe('POST /decks', () => {
  //   it('should create a new deck', async () => {
  //     const deckData = {
  //       name: 'Test Deck',
  //       cardIds: [1, 2, 3],
  //     };

  //     const res = await app.request('/decks', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(deckData),
  //     });

  //     const data = await res.json();

  //     console.log('data', data);

  //     expect(res.status).toBe(201);
  //     expect(data.id).toBeDefined();
  //   });
  // });
});
