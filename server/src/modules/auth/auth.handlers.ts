import { db } from '@/db/config';
import { playersTable } from '@/db/schemas';
import { isValidFuelAddress, verifySignature } from '@/utils/fuel-utils';
import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { z } from 'zod';

// Validation schemas
const playerSignUpSchema = z.object({
  wallet_address: z.string().min(1, 'Wallet address is required'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username too long'),
  email: z.string().email('Invalid email format'),
});

const playerSignInSchema = z.object({
  wallet_address: z.string().min(1, 'Wallet address is required'),
  signature: z.string().min(1, 'Signature is required'),
  digest: z.string().min(1, 'Digest is required'),
  encodedMessage: z.string().min(1, 'Encoded message is required'),
});

export type PlayerSignUpRequest = z.infer<typeof playerSignUpSchema>;
export type PlayerSignInRequest = z.infer<typeof playerSignInSchema>;

/**
 * Player sign up - create new player account
 */
export const playerSignUp = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { wallet_address, username, email } = playerSignUpSchema.parse(body);

    // Validate wallet address format
    if (!isValidFuelAddress(wallet_address)) {
      return c.json(
        {
          success: false,
          error: 'Invalid wallet address format',
        },
        400
      );
    }

    // Check if wallet address already exists
    const existingWallet = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.wallet_address, wallet_address))
      .limit(1);

    if (existingWallet.length > 0) {
      return c.json(
        {
          success: false,
          error: 'Wallet address already registered',
        },
        409
      );
    }

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
        wallet_address,
        username,
        email,
      })
      .returning();

    const player = newPlayer[0];

    return c.json({
      success: true,
      message: 'Player registered successfully',
      player: {
        wallet_address: player.wallet_address,
        username: player.username,
        email: player.email,
        balance: player.balance,
        rank: player.rank,
        created_at: player.created_at,
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
 * Player sign in - verify wallet signature and get player
 */
export const playerSignIn = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { wallet_address, signature, digest, encodedMessage } =
      playerSignInSchema.parse(body);

    // Validate wallet address format
    if (!isValidFuelAddress(wallet_address)) {
      return c.json(
        {
          success: false,
          error: 'Invalid wallet address format',
        },
        400
      );
    }

    // Verify signature
    const isValidSignature = await verifySignature(
      wallet_address,
      signature,
      encodedMessage
    );
    if (!isValidSignature) {
      return c.json(
        {
          success: false,
          error: 'Invalid signature',
        },
        401
      );
    }

    // Find player by wallet address
    const player = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.wallet_address, wallet_address))
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

    // Update last login
    await db
      .update(playersTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(playersTable.wallet_address, wallet_address));

    return c.json({
      success: true,
      message: 'Player signed in successfully',
      player: {
        wallet_address: playerData.wallet_address,
        username: playerData.username,
        email: playerData.email,
        balance: playerData.balance,
        rank: playerData.rank,
        lastLoginAt: playerData.lastLoginAt,
        created_at: playerData.created_at,
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
 * Get player profile by wallet address
 */
export const getPlayerProfile = async (c: Context) => {
  try {
    const address = c.req.param('address');

    if (!address) {
      return c.json(
        {
          success: false,
          error: 'Wallet address is required',
        },
        400
      );
    }

    // Validate address format
    if (!isValidFuelAddress(address)) {
      return c.json(
        {
          success: false,
          error: 'Invalid wallet address format',
        },
        400
      );
    }

    // Get player from database
    const player = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.wallet_address, address))
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
        wallet_address: playerData.wallet_address,
        username: playerData.username,
        email: playerData.email,
        balance: playerData.balance,
        rank: playerData.rank,
        lastLoginAt: playerData.lastLoginAt,
        created_at: playerData.created_at,
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
