import { db } from '@/db/config';
import { gameRoomPlayersTable, gameRoomsTable } from '@/db/schemas';
import type { AppRouteHandler } from '@/lib/types';
import { and, eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type {
  Create,
  GetById,
  Join,
  Leave,
  List,
  StartGame,
  UpdateReadyStatus,
} from './game-rooms.routes';

export const list: AppRouteHandler<List> = async (c) => {
  const status = c.req.query('status');
  const includePlayers = c.req.query('includePlayers') === 'true';

  const whereConditions = status
    ? eq(
        gameRoomsTable.status,
        status as 'waiting' | 'in_progress' | 'finished' | 'cancelled'
      )
    : undefined;

  const rooms = await db.query.gameRoomsTable.findMany({
    where: whereConditions,
    with: includePlayers
      ? {
          players: true,
        }
      : undefined,
  });

  return c.json(rooms);
};

export const create: AppRouteHandler<Create> = async (c) => {
  const body = c.req.valid('json');
  const [room] = await db.insert(gameRoomsTable).values(body).returning();

  return c.json(room, HttpStatusCodes.CREATED);
};

export const getById: AppRouteHandler<GetById> = async (c) => {
  const { id } = c.req.valid('param');
  const includePlayers = c.req.query('includePlayers') === 'true';

  const room = await db.query.gameRoomsTable.findFirst({
    where: eq(gameRoomsTable.id, id),
    with: includePlayers
      ? {
          players: true,
        }
      : undefined,
  });

  if (!room) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    ) as any;
  }

  return c.json(room);
};

export const join: AppRouteHandler<Join> = async (c) => {
  const { id } = c.req.valid('param');
  const { playerId, deckId } = c.req.valid('json');

  // Check if room exists and is in waiting status
  const room = await db.query.gameRoomsTable.findFirst({
    where: eq(gameRoomsTable.id, id),
  });

  if (!room) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    ) as any;
  }

  if (room.status !== 'waiting') {
    return c.json(
      { message: 'Cannot join room that is not in waiting status' },
      HttpStatusCodes.BAD_REQUEST
    ) as any;
  }

  // Check if player is already in the room
  const existingPlayer = await db.query.gameRoomPlayersTable.findFirst({
    where: and(
      eq(gameRoomPlayersTable.roomId, id),
      eq(gameRoomPlayersTable.playerId, playerId)
    ),
  });

  if (existingPlayer) {
    return c.json(
      { message: 'Player is already in this room' },
      HttpStatusCodes.BAD_REQUEST
    ) as any;
  }

  // Check if room is full
  if (room.currentPlayers >= room.maxPlayers) {
    return c.json(
      { message: 'Room is full' },
      HttpStatusCodes.BAD_REQUEST
    ) as any;
  }

  // Use transaction to ensure atomicity
  const result = await db.transaction(async (tx) => {
    // Add player to room
    const [playerInRoom] = await tx
      .insert(gameRoomPlayersTable)
      .values({
        roomId: id,
        playerId,
        deckId,
      })
      .returning();

    // Update room's current player count
    await tx
      .update(gameRoomsTable)
      .set({ currentPlayers: room.currentPlayers + 1 })
      .where(eq(gameRoomsTable.id, id));

    return playerInRoom;
  });

  return c.json(result) as any;
};

export const leave: AppRouteHandler<Leave> = async (c) => {
  const { id } = c.req.valid('param');
  const { playerId } = c.req.valid('json');

  // Check if room exists
  const room = await db.query.gameRoomsTable.findFirst({
    where: eq(gameRoomsTable.id, id),
  });

  if (!room) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    ) as any;
  }

  // Check if player is in the room
  const playerInRoom = await db.query.gameRoomPlayersTable.findFirst({
    where: and(
      eq(gameRoomPlayersTable.roomId, id),
      eq(gameRoomPlayersTable.playerId, playerId)
    ),
  });

  if (!playerInRoom) {
    return c.json(
      { message: 'Player is not in this room' },
      HttpStatusCodes.BAD_REQUEST
    ) as any;
  }

  // Use transaction to ensure atomicity
  await db.transaction(async (tx) => {
    // Remove player from room
    await tx
      .delete(gameRoomPlayersTable)
      .where(
        and(
          eq(gameRoomPlayersTable.roomId, id),
          eq(gameRoomPlayersTable.playerId, playerId)
        )
      );

    // Update room's current player count
    await tx
      .update(gameRoomsTable)
      .set({ currentPlayers: room.currentPlayers - 1 })
      .where(eq(gameRoomsTable.id, id));
  });

  return c.json({ message: 'Successfully left the room' });
};

export const updateReadyStatus: AppRouteHandler<UpdateReadyStatus> = async (
  c
) => {
  const { id } = c.req.valid('param');
  const { isReady } = c.req.valid('json');

  // For now, we'll assume the player ID comes from authentication
  // You might want to get this from the authenticated user context
  const playerId = 1; // TODO: Get from auth context

  // Check if player is in the room
  const playerInRoom = await db.query.gameRoomPlayersTable.findFirst({
    where: and(
      eq(gameRoomPlayersTable.roomId, id),
      eq(gameRoomPlayersTable.playerId, playerId)
    ),
  });

  if (!playerInRoom) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    ) as any;
  }

  // Update ready status
  const [updatedPlayer] = await db
    .update(gameRoomPlayersTable)
    .set({ isReady })
    .where(
      and(
        eq(gameRoomPlayersTable.roomId, id),
        eq(gameRoomPlayersTable.playerId, playerId)
      )
    )
    .returning();

  return c.json(updatedPlayer) as any;
};

export const startGame: AppRouteHandler<StartGame> = async (c) => {
  const { id } = c.req.valid('param');

  // Check if room exists and is in waiting status
  const room = await db.query.gameRoomsTable.findFirst({
    where: eq(gameRoomsTable.id, id),
    with: {
      players: true,
    },
  });

  if (!room) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    ) as any;
  }

  if (room.status !== 'waiting') {
    return c.json(
      { message: 'Game can only be started from waiting status' },
      HttpStatusCodes.BAD_REQUEST
    ) as any;
  }

  // Check if all players are ready
  const allPlayersReady = room.players.every(
    (player) => player.isReady === 'ready'
  );
  if (!allPlayersReady) {
    return c.json(
      { message: 'All players must be ready to start the game' },
      HttpStatusCodes.BAD_REQUEST
    ) as any;
  }

  // Check if we have enough players (at least 2)
  if (room.players.length < 2) {
    return c.json(
      { message: 'Need at least 2 players to start the game' },
      HttpStatusCodes.BAD_REQUEST
    ) as any;
  }

  // Update room status to in_progress
  const [updatedRoom] = await db
    .update(gameRoomsTable)
    .set({ status: 'in_progress' })
    .where(eq(gameRoomsTable.id, id))
    .returning();

  return c.json(updatedRoom) as any;
};
