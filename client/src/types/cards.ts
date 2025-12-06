export type CardType = 'creature' | 'spell' | 'artifact' | 'enchantment';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'mythic';

export interface Card {
  id: number;
  name: string;
  type: CardType;
  rarity: CardRarity;
  description: string;
  power: number | null;
  toughness: number | null;
  energy_cost: number;
  abilities: Record<string, unknown> | null;
  effect: Record<string, unknown> | null;
  can_attack: boolean | null;
  created_at: string;
  updatedAt: string | null;
}

export interface CreateCardRequest {
  name: string;
  type: CardType;
  rarity: CardRarity;
  description: string;
  power?: number | null;
  toughness?: number | null;
  energy_cost?: number;
  abilities?: Record<string, unknown> | null;
  effect?: Record<string, unknown> | null;
  can_attack?: boolean | null;
}

export interface UpdateCardRequest extends Partial<CreateCardRequest> {}

