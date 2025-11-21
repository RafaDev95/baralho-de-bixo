/**
 * Card Ability Strategy Pattern
 * 
 * Encapsulates different card ability behaviors.
 * Allows cards to have different effects without modifying core game logic.
 * 
 * Benefits:
 * - Strategy Pattern: Different abilities are interchangeable
 * - Easy to add new abilities: Just implement the interface
 * - Testable: Each ability can be tested independently
 */

export interface AbilityContext {
  gameId: number;
  playerId: number;
  cardId?: number;
  targetId?: number;
  [key: string]: unknown;
}

export interface AbilityResult {
  success: boolean;
  effects?: string[];
  damage?: number;
  heal?: number;
  drawCards?: number;
  reason?: string;
}

export interface CardAbilityStrategy {
  /**
   * Execute the ability
   */
  execute(context: AbilityContext): Promise<AbilityResult>;

  /**
   * Get ability name
   */
  getName(): string;

  /**
   * Get ability description
   */
  getDescription(): string;
}

/**
 * Damage Ability - Deal damage to target
 */
export class DamageAbilityStrategy implements CardAbilityStrategy {
  private readonly damageAmount: number;

  constructor(damageAmount: number) {
    this.damageAmount = damageAmount;
  }

  getName(): string {
    return 'damage';
  }

  getDescription(): string {
    return `Deal ${this.damageAmount} damage`;
  }

  async execute(context: AbilityContext): Promise<AbilityResult> {
    return {
      success: true,
      damage: this.damageAmount,
      effects: ['damage_dealt'],
    };
  }
}

/**
 * Heal Ability - Restore health
 */
export class HealAbilityStrategy implements CardAbilityStrategy {
  private readonly healAmount: number;

  constructor(healAmount: number) {
    this.healAmount = healAmount;
  }

  getName(): string {
    return 'heal';
  }

  getDescription(): string {
    return `Heal ${this.healAmount} health`;
  }

  async execute(context: AbilityContext): Promise<AbilityResult> {
    return {
      success: true,
      heal: this.healAmount,
      effects: ['healed'],
    };
  }
}

/**
 * Draw Cards Ability - Draw cards from deck
 */
export class DrawCardsAbilityStrategy implements CardAbilityStrategy {
  private readonly cardCount: number;

  constructor(cardCount: number) {
    this.cardCount = cardCount;
  }

  getName(): string {
    return 'draw_cards';
  }

  getDescription(): string {
    return `Draw ${this.cardCount} card(s)`;
  }

  async execute(context: AbilityContext): Promise<AbilityResult> {
    return {
      success: true,
      drawCards: this.cardCount,
      effects: ['cards_drawn'],
    };
  }
}

/**
 * Card Ability Strategy Factory
 * Creates appropriate ability strategy based on ability type
 */
export class CardAbilityStrategyFactory {
  private static strategies: Map<string, (value: number) => CardAbilityStrategy> = new Map([
    ['damage', (value) => new DamageAbilityStrategy(value)],
    ['heal', (value) => new HealAbilityStrategy(value)],
    ['draw_cards', (value) => new DrawCardsAbilityStrategy(value)],
  ]);

  /**
   * Get ability strategy for a card ability
   */
  static getStrategy(
    abilityType: string,
    value: number
  ): CardAbilityStrategy | null {
    const strategyFactory = this.strategies.get(abilityType);
    if (!strategyFactory) {
      return null;
    }

    return strategyFactory(value);
  }

  /**
   * Register a custom ability strategy
   */
  static registerStrategy(
    name: string,
    factory: (value: number) => CardAbilityStrategy
  ): void {
    this.strategies.set(name, factory);
  }
}

