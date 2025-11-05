import { createAbilityRegistry } from './ability-registry';
import { combatAbilities } from './common/combat-abilities';
import { spellEffects } from './effects/spell-effects';

/**
 * Central ability registry containing all abilities
 */
export const abilityRegistry = createAbilityRegistry([
  // Combat abilities
  ...Object.values(combatAbilities),
  // Spell effects
  ...Object.values(spellEffects),
]);

/**
 * Export all abilities for easy access
 */
export * from './ability-registry';
export * from './common/combat-abilities';
export * from './effects/spell-effects';
