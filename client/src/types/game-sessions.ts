export type GameActionType =
  | 'play_card'
  | 'attack'
  | 'block'
  | 'activate_ability'
  | 'cast_spell'
  | 'draw_card'
  | 'discard_card'
  | 'end_turn'
  | 'concede'
  | 'mulligan';

export interface GameAction {
  type: GameActionType;
  data?: Record<string, unknown>;
}

export interface GamePlayer {
  id: number;
  game_id: number;
  player_id: number;
  deck_id: number | null;
  player_index: number;
  life_total: number;
  energy: number;
  max_energy: number;
  hand_size: number;
  deck_size: number;
  graveyard_size: number;
  is_active: boolean;
  has_mulliganed: boolean;
  created_at: string;
  updatedAt: string | null;
}

export interface GameCard {
  id: number;
  game_id: number;
  card_id: number;
  owner_id: number;
  controller_id: number;
  location: 'hand' | 'deck' | 'graveyard' | 'battlefield';
  zone_index: number | null;
  power: number | null;
  toughness: number | null;
  damage: number;
  counters: Record<string, unknown> | null;
  attached_to: number | null;
  created_at: string;
  updatedAt: string | null;
}

export interface GameSession {
  id: number;
  room_id: number | null;
  status: string;
  current_turn: number;
  current_player_index: number;
  phase: string;
  step: string;
  created_at: string;
  updatedAt: string | null;
  started_at: string | null;
  finished_at: string | null;
  winner_id: number | null;
}

export interface GameState {
  gameId: number;
  currentTurn: number;
  currentPlayerIndex: number;
  phase: string;
  step: string;
  players: GamePlayer[];
  cards: GameCard[];
}

export interface StartGameRequest {
  roomId: number;
}

export interface EndGameRequest {
  winnerId?: number;
}

