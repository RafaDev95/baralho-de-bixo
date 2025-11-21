import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { setupTestDatabase } from './utils/testSetup';

import { cleanupTestDatabase } from '@/db/config/drizzle.config';
import app from '../src/server/app';

describe('Player Registration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /players', () => {
    it('should successfully register a new player', async () => {
      const playerData = {
        username: 'testplayer',
        email: 'test@example.com',
      };

      const res = await app.request('/players', {
        method: 'POST',
        body: JSON.stringify(playerData),
      });

      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.id).toBeDefined();
    });
  });
});
