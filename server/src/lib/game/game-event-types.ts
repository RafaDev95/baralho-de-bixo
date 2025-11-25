/**
 * Game Event Types
 *
 * Defines all possible game events that can be emitted.
 * Used with Observer pattern for decoupled event handling.
 */

export type GameEventType =
  | 'game_started'
  | 'game_ended'
  | 'turn_started'
  | 'turn_ended'
  | 'card_played'
  | 'card_drawn'
  | 'attack_declared'
  | 'damage_dealt'
  | 'player_health_changed'
  | 'energy_changed'
  | 'phase_changed'
  | 'game_state_updated';

export interface GameEvent {
  type: GameEventType;
  gameId: number;
  playerId?: number;
  data: Record<string, unknown>;
  timestamp: Date;
}

export interface GameStartedEvent extends GameEvent {
  type: 'game_started';
  data: {
    gameId: number;
    players: Array<{ playerId: number; playerIndex: number }>;
  };
}

export interface CardPlayedEvent extends GameEvent {
  type: 'card_played';
  data: {
    cardId: number;
    cardName: string;
    playerId: number;
    energyCost: number;
  };
}

export interface AttackDeclaredEvent extends GameEvent {
  type: 'attack_declared';
  data: {
    attackerId: number;
    attackerPower: number;
    targetPlayerId: number;
  };
}

export interface DamageDealtEvent extends GameEvent {
  type: 'damage_dealt';
  data: {
    amount: number;
    targetPlayerId: number;
    newHealth: number;
  };
}

export interface PlayerHealthChangedEvent extends GameEvent {
  type: 'player_health_changed';
  data: {
    playerId: number;
    oldHealth: number;
    newHealth: number;
  };
}

export interface EnergyChangedEvent extends GameEvent {
  type: 'energy_changed';
  data: {
    playerId: number;
    oldEnergy: number;
    newEnergy: number;
    maxEnergy: number;
  };
}

export interface TurnStartedEvent extends GameEvent {
  type: 'turn_started';
  data: {
    playerId: number;
    turnNumber: number;
    energy: number;
    maxEnergy: number;
  };
}

export interface GameStateUpdatedEvent extends GameEvent {
  type: 'game_state_updated';
  data: {
    gameId: number;
    currentTurn: number;
    currentPlayerIndex: number;
    phase: string;
  };
}
