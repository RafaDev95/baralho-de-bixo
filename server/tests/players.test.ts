import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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
    it('should successfully register a new player and vinculate with a starter deck', async () => {
      const playerData = {
        walletAddress: '0x1234567890123456789012345678901234567890',
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
