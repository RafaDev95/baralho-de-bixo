import type { Player } from './players';
import type { Deck } from './decks';

export type GameRoomStatus = 'waiting' | 'in_progress' | 'finished' | 'cancelled';
export type PlayerReadyStatus = 'ready' | 'not_ready';

export interface GameRoomPlayer {
  id: number;
  room_id: number;
  player_id: number;
  joined_at: string;
  is_ready: PlayerReadyStatus;
  deck_id: number | null;
  player?: Player;
  deck?: Deck;
}

export interface GameRoom {
  id: number;
  name: string;
  status: GameRoomStatus;
  max_players: number;
  current_players: number;
  created_by: number;
  created_at: string;
  updatedAt: string | null;
  players?: GameRoomPlayer[];
}

export interface CreateGameRoomRequest {
  name: string;
  max_players?: number;
  created_by: number;
}

export interface JoinRoomRequest {
  playerId: number;
  deckId?: number;
}

export interface UpdateReadyStatusRequest {
  isReady: PlayerReadyStatus;
}

