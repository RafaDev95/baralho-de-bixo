import type {
  GameEvent,
  GameEventType,
} from './game-event-types';

/**
 * Game Event Emitter - Observer Pattern Implementation
 * 
 * Implements the Observer pattern for game events.
 * Allows decoupling of game logic from event handling (e.g., WebSocket updates).
 * 
 * Benefits:
 * - Decoupling: Game logic doesn't need to know about WebSocket/UI
 * - Extensibility: Easy to add new event listeners
 * - Testability: Can test game logic without WebSocket
 * - Real-time updates: Enables push-based updates instead of polling
 */

type EventListener = (event: GameEvent) => void | Promise<void>;

export class GameEventEmitter {
  private listeners: Map<GameEventType, Set<EventListener>> = new Map();

  /**
   * Subscribe to a specific event type
   */
  on(eventType: GameEventType, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.off(eventType, listener);
    };
  }

  /**
   * Subscribe to all events
   */
  onAll(listener: EventListener): () => void {
    const unsubscribeFunctions: Array<() => void> = [];

    // Subscribe to all known event types
    const eventTypes: GameEventType[] = [
      'game_started',
      'game_ended',
      'turn_started',
      'turn_ended',
      'card_played',
      'card_drawn',
      'attack_declared',
      'damage_dealt',
      'player_health_changed',
      'energy_changed',
      'phase_changed',
      'game_state_updated',
    ];

    for (const eventType of eventTypes) {
      const unsubscribe = this.on(eventType, listener);
      unsubscribeFunctions.push(unsubscribe);
    }

    // Return combined unsubscribe function
    return () => {
      for (const unsubscribe of unsubscribeFunctions) {
        unsubscribe();
      }
    };
  }

  /**
   * Unsubscribe from an event type
   */
  off(eventType: GameEventType, listener: EventListener): void {
    const eventListeners = this.listeners.get(eventType);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  /**
   * Emit an event to all listeners
   */
  async emit(event: GameEvent): Promise<void> {
    const eventListeners = this.listeners.get(event.type);
    if (eventListeners) {
      // Execute all listeners (can be async)
      const promises = Array.from(eventListeners).map((listener) => {
        try {
          return Promise.resolve(listener(event));
        } catch (error) {
          console.error(`Error in event listener for ${event.type}:`, error);
          return Promise.resolve();
        }
      });

      await Promise.all(promises);
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(eventType?: GameEventType): void {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get listener count for an event type
   */
  listenerCount(eventType: GameEventType): number {
    return this.listeners.get(eventType)?.size ?? 0;
  }
}

// Global event emitter instance (singleton)
export const gameEventEmitter = new GameEventEmitter();

