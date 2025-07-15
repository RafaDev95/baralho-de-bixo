import { CreateCardByTypeStrategy } from './card-type-strategies';
import type {
  ArtifactCard,
  CardDefinition,
  CreatureCard,
  EnchantmentCard,
  SpellCard,
} from './types';

export class CardFactory {
  private static readonly cardTypeDefinitions = {
    creature: (data: CardDefinition): CreatureCard => {
      CardFactory.validateBaseCard(data);
      return CreateCardByTypeStrategy.creatureCard(data);
    },
    spell: (data: CardDefinition): SpellCard => {
      CardFactory.validateBaseCard(data);
      return CreateCardByTypeStrategy.spellCard(data);
    },
    enchantment: (data: CardDefinition): EnchantmentCard => {
      CardFactory.validateBaseCard(data);
      return CreateCardByTypeStrategy.enchantmentCard(data);
    },
    artifact: (data: CardDefinition): ArtifactCard => {
      CardFactory.validateBaseCard(data);
      return CreateCardByTypeStrategy.artifactCard(data);
    },
  };

  static createCard(cardData: CardDefinition) {
    const cardDefinition = CardFactory.cardTypeDefinitions[cardData.type];
    if (!cardDefinition) {
      throw new Error(`Card type ${cardData.type} not supported`);
    }
    return cardDefinition(cardData);
  }

  private static validateBaseCard(card: CardDefinition): void {
    if (!card.name) throw new Error('Card must have a name');
    if (!card.type) throw new Error('Card must have a type');
    if (!card.rarity) throw new Error('Card must have a rarity');
    if (!card.attribute) throw new Error('Card must have an attribute');
    if (!card.manaCost) throw new Error('Card must have a mana cost');
  }
}
