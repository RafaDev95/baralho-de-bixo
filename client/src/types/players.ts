export interface Player {
  id: number;
  username: string;
  email: string;
  balance: number;
  rank: number;
  created_at: string;
}

export interface CreatePlayerRequest {
  username: string;
  email: string;
}

export interface UpdatePlayerRequest {
  username?: string;
  email?: string;
}

