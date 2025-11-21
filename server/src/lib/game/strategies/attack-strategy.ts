/**
 * Attack Strategy Pattern
 * 
 * Encapsulates different attack behaviors for creatures.
 * Allows easy extension of attack types without modifying existing code.
 * 
 * Benefits:
 * - Open/Closed Principle: Open for extension, closed for modification
 * - Single Responsibility: Each strategy handles one attack type
 * - Easy to test: Each strategy can be tested independently
 */

export interface AttackResult {
  damage: number;
  effects?: string[];
}

export interface AttackStrategy {
  /**
   * Calculate attack damage and effects
   */
  attack(
    attackerPower: number,
    context?: Record<string, unknown>
  ): AttackResult;

  /**
   * Get strategy name
   */
  getName(): string;
}

/**
 * Direct Attack Strategy - Standard attack
 * Creatures deal their power as damage directly to opponent
 */
export class DirectAttackStrategy implements AttackStrategy {
  getName(): string {
    return 'direct';
  }

  attack(
    attackerPower: number,
    _context?: Record<string, unknown>
  ): AttackResult {
    return {
      damage: attackerPower,
    };
  }
}

/**
 * Double Strike Strategy - Attack deals double damage
 */
export class DoubleStrikeStrategy implements AttackStrategy {
  getName(): string {
    return 'double_strike';
  }

  attack(
    attackerPower: number,
    _context?: Record<string, unknown>
  ): AttackResult {
    return {
      damage: attackerPower * 2,
      effects: ['double_strike'],
    };
  }
}

/**
 * Piercing Attack Strategy - Ignores some defense
 */
export class PiercingAttackStrategy implements AttackStrategy {
  private readonly pierceAmount: number;

  constructor(pierceAmount = 1) {
    this.pierceAmount = pierceAmount;
  }

  getName(): string {
    return 'piercing';
  }

  attack(
    attackerPower: number,
    _context?: Record<string, unknown>
  ): AttackResult {
    return {
      damage: attackerPower + this.pierceAmount,
      effects: ['piercing'],
    };
  }
}

/**
 * Attack Strategy Factory
 * Creates appropriate attack strategy based on card abilities
 */
export class AttackStrategyFactory {
  private static strategies: Map<string, AttackStrategy> = new Map([
    ['direct', new DirectAttackStrategy()],
    ['double_strike', new DoubleStrikeStrategy()],
    ['piercing', new PiercingAttackStrategy()],
  ]);

  /**
   * Get attack strategy for a card
   */
  static getStrategy(abilities?: string[]): AttackStrategy {
    if (!abilities || abilities.length === 0) {
      return this.strategies.get('direct')!;
    }

    // Check for special abilities
    if (abilities.includes('double_strike')) {
      return this.strategies.get('double_strike')!;
    }

    if (abilities.includes('piercing')) {
      return this.strategies.get('piercing')!;
    }

    return this.strategies.get('direct')!;
  }

  /**
   * Register a custom attack strategy
   */
  static registerStrategy(name: string, strategy: AttackStrategy): void {
    this.strategies.set(name, strategy);
  }
}

