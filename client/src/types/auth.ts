export interface Player {
  id: number;
  username: string;
  email: string;
  balance: number;
  rank: number;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  player?: Player;
  error?: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
}

export interface SignInRequest {
  email: string;
}

