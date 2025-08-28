import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CardFactory } from './cards-factory';
import { CARD_TYPE_DEFINITIONS } from './constants';
import type { CardBase, CardDefinition } from './types';

interface CardDefinitions {
  cards: CardDefinition[];
}

// Interface for file system operations to make testing easier
interface FileSystem {
  readFileSync: typeof readFileSync;
  join: typeof join;
}

export class CardLoader {
  private static instance: CardLoader;
  private cardDefinitions: CardDefinition[] = [];
  private nextId = 1;
  private loaded = false;
  private fileSystem: FileSystem;

  private constructor(fileSystem?: FileSystem) {
    this.fileSystem = fileSystem || { readFileSync, join };
  }

  public static getInstance(fileSystem?: FileSystem): CardLoader {
    if (!CardLoader.instance) {
      CardLoader.instance = new CardLoader(fileSystem);
    }
    return CardLoader.instance;
  }

  // Method to reset instance for testing
  public static resetInstance(): void {
    // @ts-ignore - Reset instance for testing
    CardLoader.instance = undefined;
  }

  private loadCardDefinitions(): void {
    if (this.loaded) return;

    try {
      const filePath = this.fileSystem.join(
        __dirname,
        '../data/card-definitions.json'
      );
      const fileContent = this.fileSystem.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent) as CardDefinitions;
      this.cardDefinitions = data.cards;
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
