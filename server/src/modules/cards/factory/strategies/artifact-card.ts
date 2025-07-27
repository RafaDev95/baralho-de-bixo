import { validateRequiredFields } from '../../utils/validations';
import type {
  ArtifactCard,
  CardDefinition,
  CardFactoryStrategy,
} from '../types';

export class ArtifactCardFactory implements CardFactoryStrategy {
  createCard(cardDefinition: CardDefinition): ArtifactCard {
    validateRequiredFields(cardDefinition, ['abilities']);

    const card: ArtifactCard = {
      ...cardDefinition,
      type: 'artifact',
      abilities: cardDefinition.abilities!,
    };
    return card;
  }
}
