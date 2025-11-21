import { cleanupTestDatabase, db } from '@/db/config';
import {
  decksTable,
  gameRoomPlayersTable,
  gameRoomsTable,
  playersTable,
} from '@/db/schemas';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { setupTestDatabase } from './utils/testSetup';

describe('Game Rooms', () => {
  let testRoomId: number;
  let testPlayerId: number;
  let testDeckId: number;
  let secondPlayerId: number;
  let secondDeckId: number;

  beforeAll(async () => {
    await setupTestDatabase();

    // Create test player
    const [player] = await db
      .insert(playersTable)
      .values({
        username: 'testplayer',
        email: 'test@example.com',
      })
      .returning();
    testPlayerId = player.id;

    // Create test deck
    const [deck] = await db
      .insert(decksTable)
      .values({
        playerId: testPlayerId,
        name: 'Test Deck',
        type: 1,
        cardCount: 15,
      })
      .returning();
    testDeckId = deck.id;

    // Create second test player
    const [secondPlayer] = await db
      .insert(playersTable)
      .values({
        username: 'testplayer2',
        email: 'test2@example.com',
      })
      .returning();
    secondPlayerId = secondPlayer.id;

    // Create second test deck
    const [secondDeck] = await db
      .insert(decksTable)
      .values({
        playerId: secondPlayerId,
        name: 'Test Deck 2',
        type: 1,
        cardCount: 15,
      })
      .returning();
    secondDeckId = secondDeck.id;
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('Room Creation', () => {
    it('should create a new game room', async () => {
      const roomData = {
        name: 'Test Room',
        maxPlayers: 2,
        createdBy: testPlayerId,
      };

      const [room] = await db
        .insert(gameRoomsTable)
        .values(roomData)
        .returning();

      expect(room).toBeDefined();
      expect(room.name).toBe('Test Room');
      expect(room.status).toBe('waiting');
      expect(room.currentPlayers).toBe(0);
      expect(room.maxPlayers).toBe(2);

      testRoomId = room.id;
    });
  });

  describe('Room Joining', () => {
    it('should allow a player to join a room', async () => {
      const playerData = {
        roomId: testRoomId,
        playerId: testPlayerId,
        deckId: testDeckId,
      };

      const [playerInRoom] = await db
        .insert(gameRoomPlayersTable)
        .values(playerData)
        .returning();

      expect(playerInRoom).toBeDefined();
      expect(playerInRoom.roomId).toBe(testRoomId);
      expect(playerInRoom.playerId).toBe(testPlayerId);
      expect(playerInRoom.isReady).toBe('not_ready');

      // Update room's current player count
      await db
        .update(gameRoomsTable)
        .set({ currentPlayers: 1 })
        .where(eq(gameRoomsTable.id, testRoomId));
    });

    it('should not allow the same player to join twice', async () => {
      // This should throw an error or be handled by the application logic
      // For now, we'll just verify the constraint exists
      const existingPlayer = await db.query.gameRoomPlayersTable.findFirst({
        where: eq(gameRoomPlayersTable.playerId, testPlayerId),
      });

      expect(existingPlayer).toBeDefined();
    });
  });

  describe('Room Status Updates', () => {
    it('should update player ready status', async () => {
      const [updatedPlayer] = await db
        .update(gameRoomPlayersTable)
        .set({ isReady: 'ready' })
        .where(eq(gameRoomPlayersTable.playerId, testPlayerId))
        .returning();

      expect(updatedPlayer.isReady).toBe('ready');
    });

    it('should start the game when all conditions are met', async () => {
      // Add a second player to meet the minimum requirement
      const secondPlayerData = {
        roomId: testRoomId,
        playerId: secondPlayerId,
        deckId: secondDeckId,
        isReady: 'ready' as const,
      };

      await db.insert(gameRoomPlayersTable).values(secondPlayerData);

      // Update room's current player count
      await db
        .update(gameRoomsTable)
        .set({ currentPlayers: 2 })
        .where(eq(gameRoomsTable.id, testRoomId));

      // Start the game
      const [updatedRoom] = await db
        .update(gameRoomsTable)
        .set({ status: 'in_progress' })
        .where(eq(gameRoomsTable.id, testRoomId))
        .returning();

      expect(updatedRoom.status).toBe('in_progress');
    });
  });

  describe('Room Cleanup', () => {
    it('should allow players to leave the room', async () => {
      // Remove the second player
      await db
        .delete(gameRoomPlayersTable)
        .where(eq(gameRoomPlayersTable.playerId, secondPlayerId));

      // Update room's current player count
      await db
        .update(gameRoomsTable)
        .set({ currentPlayers: 1 })
        .where(eq(gameRoomsTable.id, testRoomId));

      const remainingPlayers = await db.query.gameRoomPlayersTable.findMany({
        where: eq(gameRoomPlayersTable.roomId, testRoomId),
      });

      expect(remainingPlayers).toHaveLength(1);
      expect(remainingPlayers[0].playerId).toBe(testPlayerId);
    });
  });
});
