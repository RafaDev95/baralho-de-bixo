import { db } from '@/db/config';
import { gameCardsTable } from '@/db/schemas';
import { and, eq } from 'drizzle-orm';

// Mana types in the game
export type ManaType = 'red' | 'blue' | 'green' | 'white' | 'black' | 'generic';

// Mana cost structure
export interface ManaCost {
  red?: number;
  blue?: number;
  green?: number;
  white?: number;
  black?: number;
  generic?: number;
}

// Mana pool for a player
export interface ManaPool {
  red: number;
  blue: number;
  green: number;
  white: number;
  black: number;
  generic: number;
}

// Mana source (like a land)
export interface ManaSource {
  cardId: number;
  type: ManaType;
  amount: number;
  isTapped: boolean;
}

export class ManaSystem {
  /**
   * Create an empty mana pool
   */
  static createEmptyManaPool(): ManaPool {
    return {
      red: 0,
      blue: 0,
      green: 0,
      white: 0,
      black: 0,
      generic: 0,
    };
  }

  /**
   * Add mana to a pool
   */
  static addMana(pool: ManaPool, type: ManaType, amount: number): ManaPool {
    return {
      ...pool,
      [type]: pool[type] + amount,
    };
  }

  /**
   * Remove mana from a pool
   */
  static removeMana(pool: ManaPool, type: ManaType, amount: number): ManaPool {
    const current = pool[type];
    const newAmount = Math.max(0, current - amount);
    return {
      ...pool,
      [type]: newAmount,
    };
  }

  /**
   * Check if a player can pay a mana cost
   */
  static canPayManaCost(pool: ManaPool, cost: ManaCost): boolean {
    // Check colored mana requirements first
    for (const [color, amount] of Object.entries(cost)) {
      if (color === 'generic') continue;

      const manaType = color as ManaType;
      if (pool[manaType] < (amount || 0)) {
        return false;
      }
    }

    // Check if we have enough total mana (including generic)
    const totalRequired = Object.values(cost).reduce(
      (sum, amount) => sum + (amount || 0),
      0
    );
    const totalAvailable = Object.values(pool).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return totalAvailable >= totalRequired;
  }

  /**
   * Pay a mana cost from a pool
   */
  static payManaCost(
    pool: ManaPool,
    cost: ManaCost
  ): { newPool: ManaPool; usedMana: ManaCost } {
    const newPool = { ...pool };
    const usedMana: ManaCost = {};

    // First, pay colored mana costs
    for (const [color, amount] of Object.entries(cost)) {
      if (color === 'generic') continue;

      const manaType = color as ManaType;
      const costAmount = amount || 0;
      const available = newPool[manaType];
      const used = Math.min(available, costAmount);

      newPool[manaType] -= used;
      usedMana[manaType] = used;
    }

    // Then pay generic costs using remaining mana
    const genericCost = cost.generic || 0;
    let genericPaid = 0;

    // Try to pay with colored mana first (in order of preference)
    const colorOrder: ManaType[] = ['red', 'blue', 'green', 'white', 'black'];

    for (const color of colorOrder) {
      if (genericPaid >= genericCost) break;

      const available = newPool[color];
      const needed = genericCost - genericPaid;
      const used = Math.min(available, needed);

      newPool[color] -= used;
      genericPaid += used;
    }

    if (genericPaid > 0) {
      usedMana.generic = genericPaid;
    }

    return { newPool, usedMana };
  }

  /**
   * Get mana cost from a card
   */
  static parseManaCost(
    manaCostData: Record<string, unknown> | null | undefined
  ): ManaCost {
    if (!manaCostData || typeof manaCostData !== 'object') {
      return { generic: 0 };
    }

    return {
      red: (manaCostData.red as number) || 0,
      blue: (manaCostData.blue as number) || 0,
      green: (manaCostData.green as number) || 0,
      white: (manaCostData.white as number) || 0,
      black: (manaCostData.black as number) || 0,
      generic: (manaCostData.generic as number) || 0,
    };
  }

  /**
   * Calculate total mana value of a cost
   */
  static getTotalManaValue(cost: ManaCost): number {
    return Object.values(cost).reduce((sum, amount) => sum + (amount || 0), 0);
  }

  /**
   * Get mana type from a land card name
   */
  static getLandManaType(cardName: string): ManaType | null {
    const name = cardName.toLowerCase();

    if (name.includes('mountain')) return 'red';
    if (name.includes('island')) return 'blue';
    if (name.includes('forest')) return 'green';
    if (name.includes('plains')) return 'white';
    if (name.includes('swamp')) return 'black';

    return null;
  }

  /**
   * Get available mana for a player (from untapped sources)
   */
  static async getAvailableMana(
    gameId: number,
    playerId: number
  ): Promise<ManaPool> {
    const sources = await ManaSystem.getPlayerManaSources(gameId, playerId);
    const pool = ManaSystem.createEmptyManaPool();

    for (const source of sources) {
      if (!source.isTapped) {
        ManaSystem.addMana(pool, source.type, source.amount);
      }
    }

    return pool;
  }

  /**
   * Get mana sources (lands) for a player in a game
   */
  static async getPlayerManaSources(
    gameId: number,
    playerId: number
  ): Promise<ManaSource[]> {
    const lands = await db
      .select()
      .from(gameCardsTable)
      .where(
        and(
          eq(gameCardsTable.gameId, gameId),
          eq(gameCardsTable.ownerId, playerId),
          eq(gameCardsTable.location, 'battlefield')
        )
      );

    const manaSources: ManaSource[] = [];

    for (const land of lands) {
      // Check if it's a land card and get its mana type
      const card = await db.query.cardsTable.findFirst({
        where: eq(db.query.cardsTable.id, land.cardId),
      });

      if (card && card.type === 'artifact') {
        // For now, assume basic lands (stored as artifacts) produce 1 mana of their color
        const manaType = ManaSystem.getLandManaType(card.name);
        if (manaType) {
          manaSources.push({
            cardId: land.id,
            type: manaType,
            amount: 1,
            isTapped: land.isTapped || false,
          });
        }
      }
    }

    return manaSources;
  }

  /**
   * Validate if a player can play a card
   */
  static async canPlayCard(
    gameId: number,
    playerId: number,
    cardId: number
  ): Promise<{ canPlay: boolean; reason?: string }> {
    // Get the card details
    const card = await db.query.cardsTable.findFirst({
      where: eq(db.query.cardsTable.id, cardId),
    });

    if (!card) {
      return { canPlay: false, reason: 'Card not found' };
    }

    // Get player's available mana
    const availableMana = await ManaSystem.getAvailableMana(gameId, playerId);

    // Parse the card's mana cost
    const manaCost = ManaSystem.parseManaCost(card.manaCost);

    // Check if player can pay the cost
    if (!ManaSystem.canPayManaCost(availableMana, manaCost)) {
      return {
        canPlay: false,
        reason: `Insufficient mana. Need ${JSON.stringify(manaCost)}, have ${JSON.stringify(availableMana)}`,
      };
    }

    return { canPlay: true };
  }

  /**
   * Tap a mana source
   */
  static async tapManaSource(gameId: number, cardId: number): Promise<void> {
    await db
      .update(gameCardsTable)
      .set({ isTapped: true })
      .where(
        and(eq(gameCardsTable.gameId, gameId), eq(gameCardsTable.id, cardId))
      );
  }

  /**
   * Untap all mana sources for a player
   */
  static async untapManaSources(
    gameId: number,
    playerId: number
  ): Promise<void> {
    await db
      .update(gameCardsTable)
      .set({ isTapped: false })
      .where(
        and(
          eq(gameCardsTable.gameId, gameId),
          eq(gameCardsTable.ownerId, playerId),
          eq(gameCardsTable.location, 'battlefield')
        )
      );
  }

  /**
   * Play a card and pay its mana cost
   */
  static async playCard(
    gameId: number,
    playerId: number,
    cardId: number
  ): Promise<{ success: boolean; reason?: string; usedMana?: ManaCost }> {
    // Validate the play
    const validation = await ManaSystem.canPlayCard(gameId, playerId, cardId);
    if (!validation.canPlay) {
      return { success: false, reason: validation.reason };
    }

    // Get the card and its mana cost
    const card = await db.query.cardsTable.findFirst({
      where: eq(db.query.cardsTable.id, cardId),
    });

    if (!card) {
      return { success: false, reason: 'Card not found' };
    }

    const manaCost = ManaSystem.parseManaCost(card.manaCost);

    // Get available mana sources and pay the cost
    const sources = await ManaSystem.getPlayerManaSources(gameId, playerId);
    const availableMana = await ManaSystem.getAvailableMana(gameId, playerId);

    // Pay the mana cost
    const { usedMana } = ManaSystem.payManaCost(availableMana, manaCost);

    // Tap the mana sources that were used
    await ManaSystem.tapManaSourcesForCost(gameId, playerId, usedMana, sources);

    return { success: true, usedMana };
  }

  /**
   * Tap mana sources to pay a cost
   */
  private static async tapManaSourcesForCost(
    _gameId: number,
    _playerId: number,
    usedMana: ManaCost,
    sources: ManaSource[]
  ): Promise<void> {
    const untappedSources = sources.filter((s) => !s.isTapped);
    const sourcesToTap: number[] = [];

    // First, tap sources for colored mana
    for (const [color, amount] of Object.entries(usedMana)) {
      if (color === 'generic') continue;

      const manaType = color as ManaType;
      const needed = amount || 0;

      let tapped = 0;
      for (const source of untappedSources) {
        if (tapped >= needed) break;
        if (source.type === manaType && !sourcesToTap.includes(source.cardId)) {
          sourcesToTap.push(source.cardId);
          tapped++;
        }
      }
    }

    // Then tap sources for generic mana
    const genericNeeded = usedMana.generic || 0;
    let genericTapped = 0;

    for (const source of untappedSources) {
      if (genericTapped >= genericNeeded) break;
      if (!sourcesToTap.includes(source.cardId)) {
        sourcesToTap.push(source.cardId);
        genericTapped++;
      }
    }

    // Tap all the sources
    for (const cardId of sourcesToTap) {
      await ManaSystem.tapManaSource(gameId, cardId);
    }
  }
}
