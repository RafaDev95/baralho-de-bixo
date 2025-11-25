/**
 * Game Engine Module
 *
 * Core game logic and mechanics:
 * - Game engine (turn management, state management)
 * - Energy system
 * - Event system (Observer pattern)
 * - Strategy patterns (attack, abilities)
 */

export { GameEngine, gameEngine } from './game-engine-simple';
export type { GameState, GameAction } from './game-engine-simple';

export { EnergySystem } from './energy-system';

export { gameEventEmitter } from './game-event-emitter';
export type { GameEvent, GameEventType } from './game-event-types';

export * from './strategies';
