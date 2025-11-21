import { db } from '@/db/config';
import { cardsTable, gameCardsTable, gamePlayersTable } from '@/db/schemas';
import { and, eq } from 'drizzle-orm';

/**
 * Energy System - Simplified resource management
 * 
 * Players start with 1 energy and gain +1 per turn (max 10).
 * Cards cost energy to play (simple integer cost).
 * Energy resets to max at the start of each turn.
 */
export class EnergySystem {
  /**
   * Get current energy for a player
   */
  static async getPlayerEnergy(
    gameId: number,
    playerId: number
  ): Promise<{ energy: number; maxEnergy: number }> {
    const player = await db.query.gamePlayersTable.findFirst({
      where: and(
        eq(gamePlayersTable.gameId, gameId),
        eq(gamePlayersTable.playerId, playerId)
      ),
    });

    if (!player) {
      throw new Error('Player not found');
    }

    return {
      energy: player.energy ?? 1,
      maxEnergy: player.maxEnergy ?? 1,
    };
  }

  /**
   * Check if a player can play a card (has enough energy)
   */
  static async canPlayCard(
    gameId: number,
    playerId: number,
    cardId: number
  ): Promise<{ canPlay: boolean; reason?: string }> {
    // Get the card details
    const card = await db.query.cardsTable.findFirst({
      where: eq(cardsTable.id, cardId),
    });

    if (!card) {
      return { canPlay: false, reason: 'Card not found' };
    }

    // Get player's current energy
    const { energy } = await EnergySystem.getPlayerEnergy(gameId, playerId);

    // Get card energy cost (use energyCost if available, otherwise default to 0)
    const energyCost = (card.energyCost as number) ?? 0;

    // Check if player has enough energy
    if (energy < energyCost) {
      return {
        canPlay: false,
        reason: `Insufficient energy. Need ${energyCost}, have ${energy}`,
      };
    }

    return { canPlay: true };
  }

  /**
   * Pay energy cost for playing a card
   */
  static async payEnergyCost(
    gameId: number,
    playerId: number,
    energyCost: number
  ): Promise<void> {
    const player = await db.query.gamePlayersTable.findFirst({
      where: and(
        eq(gamePlayersTable.gameId, gameId),
        eq(gamePlayersTable.playerId, playerId)
      ),
    });

    if (!player) {
      throw new Error('Player not found');
    }

    const currentEnergy = player.energy ?? 1;
    const newEnergy = Math.max(0, currentEnergy - energyCost);

    await db
      .update(gamePlayersTable)
      .set({ energy: newEnergy })
      .where(
        and(
          eq(gamePlayersTable.gameId, gameId),
          eq(gamePlayersTable.playerId, playerId)
        )
      );
  }

  /**
   * Start a new turn - reset energy to max and increase max energy
   */
  static async startTurn(
    gameId: number,
    playerId: number
  ): Promise<void> {
    const player = await db.query.gamePlayersTable.findFirst({
      where: and(
        eq(gamePlayersTable.gameId, gameId),
        eq(gamePlayersTable.playerId, playerId)
      ),
    });

    if (!player) {
      throw new Error('Player not found');
    }

    const currentMaxEnergy = player.maxEnergy ?? 1;
    const newMaxEnergy = Math.min(10, currentMaxEnergy + 1);

    await db
      .update(gamePlayersTable)
      .set({
        energy: newMaxEnergy,
        maxEnergy: newMaxEnergy,
      })
      .where(
        and(
          eq(gamePlayersTable.gameId, gameId),
          eq(gamePlayersTable.playerId, playerId)
        )
      );
  }

  /**
   * Get energy cost from a card
   */
  static getCardEnergyCost(card: { energyCost?: number | null }): number {
    if (typeof card.energyCost === 'number') {
      return card.energyCost;
    }
    return 0;
  }
}

