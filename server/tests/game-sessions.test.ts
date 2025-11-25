import { cleanupTestDatabase, db } from '@/db/config';
import {
  cardsTable,
  deckCards,
  decksTable,
  gameRoomPlayersTable,
  gameRoomsTable,
  playersTable,
} from '@/db/schemas';
import { gameEngine } from '@/lib/game';
import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { setupTestDatabase } from './utils/testSetup';

describe('Game Sessions', () => {
  let testRoomId: number;
  let testPlayerId: number;
  let testDeckId: number;
  let testCardId: number;
  let gameSessionId: number;

  beforeAll(
    async () => {
      await setupTestDatabase();

      // Create test data
      const [testPlayer] = await db
        .insert(playersTable)
        .values({
          username: 'testplayer',
          email: 'test@example.com',
        })
        .returning();
      testPlayerId = testPlayer.id;

      const [testCard] = await db
        .insert(cardsTable)
        .values({
          name: 'Test Card',
          type: 'creature',
          rarity: 'common',
          description: 'A test card',
          power: 2,
          toughness: 2,
          energyCost: 2,
        })
        .returning();
      testCardId = testCard.id;

      const [testDeck] = await db
        .insert(decksTable)
        .values({
          name: 'Test Deck',
          playerId: testPlayerId,
          type: 1,
        })
        .returning();
      testDeckId = testDeck.id;

      // Add card to deck
      await db.insert(deckCards).values({
        deckId: testDeckId,
        cardId: testCardId,
      });

      // Create a second player and deck for the room
      const [secondPlayer] = await db
        .insert(playersTable)
        .values({
          username: 'secondplayer',
          email: 'second@example.com',
        })
        .returning();

      const [secondDeck] = await db
        .insert(decksTable)
        .values({
          name: 'Second Deck',
          playerId: secondPlayer.id,
          type: 1,
        })
        .returning();

      await db.insert(deckCards).values({
        deckId: secondDeck.id,
        cardId: testCardId,
      });

      // Create test room
      const [testRoom] = await db
        .insert(gameRoomsTable)
        .values({
          name: 'Test Game Room',
          status: 'waiting',
          maxPlayers: 2,
          currentPlayers: 2,
          createdBy: testPlayerId,
        })
        .returning();
      testRoomId = testRoom.id;

      // Add players to room
      await db.insert(gameRoomPlayersTable).values([
        {
          roomId: testRoomId,
          playerId: testPlayerId,
          deckId: testDeckId,
          isReady: 'ready',
        },
        {
          roomId: testRoomId,
          playerId: secondPlayer.id,
          deckId: secondDeck.id,
          isReady: 'ready',
        },
      ]);
    },
    120000 // 2 minute timeout for testcontainers to start
  );

  afterAll(
    async () => {
      await cleanupTestDatabase();
    },
    30000 // 30 second timeout for cleanup
  );

  describe('Game Engine', () => {
    it('should create a game session from a ready room', async () => {
      const gameSession = await gameEngine.createGameSession(testRoomId);

      expect(gameSession).toBeDefined();
      expect(gameSession.roomId).toBe(testRoomId);
      expect(gameSession.status).toBe('active');
      expect(gameSession.startedAt).toBeDefined();

      // Store game session ID for other tests
      gameSessionId = gameSession.id;
    });

    it('should initialize player decks and hands', async () => {
      const gameState = gameEngine.getGameState(gameSessionId);

      expect(gameState).toBeDefined();
      expect(gameState?.players).toHaveLength(2);
      expect(gameState?.currentTurn).toBe(1);
      expect(gameState?.currentPlayerIndex).toBe(0);
      // After game creation, phase moves to 'draw' after untap (startTurn is called)
      expect(gameState?.phase).toBe('draw');
      expect(gameState?.step).toBe('beginning');
    });

    it('should reject creating game from non-ready room', async () => {
      // Create a room that's not ready
      const [notReadyRoom] = await db
        .insert(gameRoomsTable)
        .values({
          name: 'Not Ready Room',
          status: 'waiting',
          maxPlayers: 2,
          currentPlayers: 1,
          createdBy: testPlayerId,
        })
        .returning();

      await expect(
        gameEngine.createGameSession(notReadyRoom.id)
      ).rejects.toThrow('Need at least 2 players to start a game');
    });

    it('should reject creating game from room with unready players', async () => {
      // Create a room with unready players
      const [unreadyRoom] = await db
        .insert(gameRoomsTable)
        .values({
          name: 'Unready Room',
          status: 'waiting',
          maxPlayers: 2,
          currentPlayers: 2,
          createdBy: testPlayerId,
        })
        .returning();

      // Add players but make one not ready
      await db.insert(gameRoomPlayersTable).values([
        {
          roomId: unreadyRoom.id,
          playerId: testPlayerId,
          deckId: testDeckId,
          isReady: 'ready',
        },
        {
          roomId: unreadyRoom.id,
          playerId: testPlayerId, // Same player, but not ready
          deckId: testDeckId,
          isReady: 'not_ready',
        },
      ]);

      await expect(
        gameEngine.createGameSession(unreadyRoom.id)
      ).rejects.toThrow('All players must be ready to start the game');
    });
  });

  describe('Game Actions', () => {
    it('should process end turn action', async () => {
      const gameState = gameEngine.getGameState(gameSessionId);
      if (!gameState) throw new Error('Game state not found');

      const initialPlayerIndex = gameState.currentPlayerIndex;
      const initialTurn = gameState.currentTurn;

      await gameEngine.processGameAction(gameSessionId, {
        type: 'end_turn',
        playerId: gameState.players[initialPlayerIndex].playerId,
      });

      const updatedGameState = gameEngine.getGameState(gameSessionId);
      expect(updatedGameState).toBeDefined();

      if (updatedGameState) {
        // Should advance to next player
        expect(updatedGameState.currentPlayerIndex).toBe(
          (initialPlayerIndex + 1) % 2
        );

        // If we completed a full round, turn should advance
        if (updatedGameState.currentPlayerIndex === 0) {
          expect(updatedGameState.currentTurn).toBe(initialTurn + 1);
        } else {
          expect(updatedGameState.currentTurn).toBe(initialTurn);
        }

        // Phase and step should reset (moves to draw after untap)
        expect(updatedGameState.phase).toBe('draw');
        expect(updatedGameState.step).toBe('beginning');
      }
    });

    it('should reject actions from non-current player', async () => {
      const gameState = gameEngine.getGameState(gameSessionId);
      if (!gameState) throw new Error('Game state not found');

      const nonCurrentPlayer = gameState.players.find(
        (p) =>
          p.playerId !==
          gameState.players[gameState.currentPlayerIndex].playerId
      );
      if (!nonCurrentPlayer) throw new Error('No non-current player found');

      await expect(
        gameEngine.processGameAction(gameSessionId, {
          type: 'end_turn',
          playerId: nonCurrentPlayer.playerId,
        })
      ).rejects.toThrow('Invalid action for current game state');
    });
  });

  describe('Game State Management', () => {
    it('should maintain game state in memory', () => {
      const gameState = gameEngine.getGameState(gameSessionId);
      expect(gameState).toBeDefined();
      expect(gameState?.gameId).toBe(gameSessionId);
    });

    it('should return all active games', () => {
      const activeGames = gameEngine.getActiveGames();
      expect(activeGames).toHaveLength(1);
      expect(activeGames[0].gameId).toBe(gameSessionId);
    });
  });
});
