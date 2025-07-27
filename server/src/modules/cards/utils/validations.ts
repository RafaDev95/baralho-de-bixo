import type { CardDefinition } from '../factory/types';

export const validateRequiredFields = (
  cardDefinition: CardDefinition,
  requiredFields: (keyof CardDefinition)[]
) => {
  for (const field of requiredFields) {
    if (!cardDefinition[field])
      throw new Error(
        `Missing ${field} for ${cardDefinition.type} card ${cardDefinition.name}`
      );
  }
};

export const validatePositiveNumber = (
  value: number | undefined,
  fieldName: string
) => {
  if (value === undefined) throw new Error(`Missing ${fieldName}`);
  if (value < 0) throw new Error(`${fieldName} must be positive`);
  return value;
};
