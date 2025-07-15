import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CardFactory } from './cards-factory';
import type { CardBase, CardDefinition } from './types';

interface CardDefinitions {
  cards: CardDefinition[];
}

export class CardLoader {
  private static instance: CardLoader;
  private cardDefinitions: CardDefinition[] = [];
  private nextId = 1;

  private constructor() {
    this.loadCardDefinitions();
  }

  public static getInstance(): CardLoader {
    if (!CardLoader.instance) {
      CardLoader.instance = new CardLoader();
    }
    return CardLoader.instance;
  }

  private loadCardDefinitions(): void {
    try {
      const filePath = join(__dirname, '../data/card-definitions.json');
      const fileContent = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent) as CardDefinitions;
      this.cardDefinitions = data.cards;
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

    return CardFactory.createCard(baseCardData);
  }

  public loadAllCards(): CardBase[] {
    return this.cardDefinitions.map((def) => this.createCard(def));
  }
}
