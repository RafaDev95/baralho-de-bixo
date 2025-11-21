import { db } from '@/db/config';
import { playersTable } from '@/db/schemas';
import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { z } from 'zod';

// Validation schemas
const playerSignUpSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username too long'),
  email: z.string().email('Invalid email format'),
});

const playerSignInSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export type PlayerSignUpRequest = z.infer<typeof playerSignUpSchema>;
export type PlayerSignInRequest = z.infer<typeof playerSignInSchema>;

/**
 * Player sign up - create new player account
 */
export const playerSignUp = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { username, email } = playerSignUpSchema.parse(body);

    // Check if username already exists
    const existingUsername = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.username, username))
      .limit(1);

    if (existingUsername.length > 0) {
      return c.json(
        {
          success: false,
          error: 'Username already taken',
        },
        409
      );
    }

    // Check if email already exists
    const existingEmail = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      return c.json(
        {
          success: false,
          error: 'Email already registered',
        },
        409
      );
    }

    // Create new player
    const newPlayer = await db
      .insert(playersTable)
      .values({
        username,
        email,
      })
      .returning();

    const player = newPlayer[0];

    return c.json({
      success: true,
      message: 'Player registered successfully',
      player: {
        id: player.id,
        username: player.username,
        email: player.email,
        balance: player.balance,
        rank: player.rank,
        created_at: player.createdAt,
      },
    });
  } catch (error) {
    console.error('Player sign up error:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to register player',
      },
      400
    );
  }
};

/**
 * Player sign in - get player by email
 */
export const playerSignIn = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { email } = playerSignInSchema.parse(body);

    // Find player by email
    const player = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.email, email))
      .limit(1);

    if (player.length === 0) {
      return c.json(
        {
          success: false,
          error: 'Player not found. Please sign up first.',
        },
        404
      );
    }

    const playerData = player[0];

    return c.json({
      success: true,
      message: 'Player signed in successfully',
      player: {
        id: playerData.id,
        username: playerData.username,
        email: playerData.email,
        balance: playerData.balance,
        rank: playerData.rank,
        created_at: playerData.createdAt,
      },
    });
  } catch (error) {
    console.error('Player sign in error:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to sign in player',
      },
      400
    );
  }
};

/**
 * Get player profile by email
 */
export const getPlayerProfile = async (c: Context) => {
  try {
    const email = c.req.param('email');

    if (!email) {
      return c.json(
        {
          success: false,
          error: 'Email is required',
        },
        400
      );
    }

    // Get player from database
    const player = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.email, email))
      .limit(1);

    if (player.length === 0) {
      return c.json(
        {
          success: false,
          error: 'Player not found',
        },
        404
      );
    }

    const playerData = player[0];

    return c.json({
      success: true,
      player: {
        id: playerData.id,
        username: playerData.username,
        email: playerData.email,
        balance: playerData.balance,
        rank: playerData.rank,
        created_at: playerData.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch player profile',
      },
      500
    );
  }
};
