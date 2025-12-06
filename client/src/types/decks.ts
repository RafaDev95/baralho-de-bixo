import type { Card } from './cards';

export type DeckType = 0 | 1; // 0 = starter, 1 = custom (based on integer type)

export interface DeckCard {
  deckId: number;
  cardId: number;
  card?: Card;
}

export interface Deck {
  id: number;
  player_id: number | null;
  name: string;
  is_active: boolean | null;
  card_count: number;
  type: number;
  created_at: string;
  updatedAt: string | null;
  cards?: DeckCard[];
}

export interface CreateDeckRequest {
  player_id?: number | null;
  name: string;
  is_active?: boolean | null;
  type: number;
  cardIds: number[];
}

export interface UpdateDeckRequest {
  name?: string;
  is_active?: boolean | null;
  type?: number;
}

