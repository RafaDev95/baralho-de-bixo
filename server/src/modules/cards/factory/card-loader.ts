import { CardFactory } from './cards-factory';
import { CARD_TYPE_DEFINITIONS } from './constants';
import type { CardBase, CardDefinition } from './types';
import type { TypedCardDefinition } from './card-definition-builder';
import * as localCardDefinitions from '../definitions';

export class CardLoader {
  private static instance: CardLoader;
  private cardDefinitions: CardDefinition[] = [];
  private nextId = 1;
  private loaded = false;

  private constructor() {}

  public static getInstance(): CardLoader {
    if (!CardLoader.instance) {
      CardLoader.instance = new CardLoader();
    }
    return CardLoader.instance;
  }

  public static resetInstance(): void {
    // @ts-expect-error - Reset instance for testing
    CardLoader.instance = undefined;
  }

  private loadCardDefinitions(): void {
    if (this.loaded) return;

    try {
      // Import all card definitions from TypeScript modules
      const allCards = Object.values(localCardDefinitions).filter(
        (card) => typeof card === 'object' && card !== null && 'name' in card
      ) as TypedCardDefinition[];

      this.cardDefinitions = allCards.map((card) => {
        const baseCard: CardDefinition = {
          name: card.name,
          type: card.type,
          rarity: card.rarity,
          description: card.description,
          energyCost: card.energyCost,
        };

        // Add type-specific properties
        if (card.type === 'creature') {
          baseCard.power = card.power;
          baseCard.toughness = card.toughness;
          baseCard.abilities = card.abilities || [];
        }

        if (card.type === 'spell') {
          baseCard.effect = card.effect;
        }

        if (card.type === 'enchantment' || card.type === 'artifact') {
          baseCard.abilities = card.abilities;
        }

        return baseCard;
      });

      this.loaded = true;
    } catch (error) {
      console.error('Error loading card definitions:', error);
      throw new Error('Failed to load card definitions');
    }
  }

  private createCard(definition: CardDefinition): CardBase {
    const baseCardData = {
      id: this.nextId++,
      ...definition,
    };

    const cardFactory = new CardFactory(CARD_TYPE_DEFINITIONS[definition.type]);

    return cardFactory.createCard(baseCardData);
  }

  public loadAllCards(): CardBase[] {
    // Load definitions when first needed
    if (!this.loaded) {
      this.loadCardDefinitions();
    }
    return this.cardDefinitions.map((def) => this.createCard(def));
  }
}
