import type {
  AbilityTrigger,
  EffectType,
  EffectTarget,
  CardAbility,
  EffectCondition,
  EffectDuration,
} from '../factory/types';

/**
 * Type-safe ability definition interface
 */
export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  trigger: AbilityTrigger;
  effect: {
    type: EffectType;
    target: EffectTarget;
    value?: number;
    condition?: EffectCondition;
    duration?: EffectDuration;
    power?: number;
    toughness?: number;
    abilities?: CardAbility[];
    position?: 'top' | 'bottom';
    [key: string]: unknown; // Allow additional properties for flexibility
  };
}

/**
 * Type-safe ability builder
 */
export const defineAbility = <T extends AbilityDefinition>(ability: T) => {
  // Validate ability structure
  validateAbility(ability);

  return ability;
};

/**
 * Validate ability definition
 */
function validateAbility(ability: AbilityDefinition): void {
  if (!ability.id) {
    throw new Error('Ability must have an id');
  }

  if (!ability.name) {
    throw new Error('Ability must have a name');
  }

  if (!ability.description) {
    throw new Error('Ability must have a description');
  }

  if (!ability.trigger) {
    throw new Error('Ability must have a trigger');
  }

  if (!ability.effect) {
    throw new Error('Ability must have an effect');
  }

  if (!ability.effect.type) {
    throw new Error('Ability effect must have a type');
  }

  if (!ability.effect.target) {
    throw new Error('Ability effect must have a target');
  }
}

/**
 * Ability registry type for runtime lookup
 */
export type AbilityRegistry = Record<string, AbilityDefinition>;

/**
 * Create ability registry from ability definitions
 */
export function createAbilityRegistry(
  abilities: AbilityDefinition[]
): AbilityRegistry {
  const registry: AbilityRegistry = {};

  for (const ability of abilities) {
    if (registry[ability.id]) {
      throw new Error(`Duplicate ability id: ${ability.id}`);
    }
    registry[ability.id] = ability;
  }

  return registry;
}

/**
 * Get ability by id from registry
 */
export function getAbility(
  registry: AbilityRegistry,
  id: string
): AbilityDefinition | undefined {
  return registry[id];
}

/**
 * Validate ability exists in registry
 */
export function validateAbilityExists(
  registry: AbilityRegistry,
  id: string
): void {
  if (!registry[id]) {
    throw new Error(`Ability not found: ${id}`);
  }
}
