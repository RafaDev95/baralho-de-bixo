import { apiClient } from './api-client';
import type {
  GameSession,
  GameState,
  GameAction,
  StartGameRequest,
  EndGameRequest,
} from '../types/game-sessions';

class GameSessionsService {
  async startGame(data: StartGameRequest): Promise<GameSession> {
    return apiClient.post<GameSession>('/game-sessions/start', data);
  }

  async getGameState(gameId: number): Promise<GameState> {
    return apiClient.get<GameState>(`/game-sessions/${gameId}/state`);
  }

  async processGameAction(gameId: number, action: GameAction): Promise<void> {
    return apiClient.post<void>(`/game-sessions/${gameId}/action`, action);
  }

  async endGame(gameId: number, data?: EndGameRequest): Promise<void> {
    return apiClient.post<void>(`/game-sessions/${gameId}/end`, data);
  }

  async getActiveGames(): Promise<GameSession[]> {
    return apiClient.get<GameSession[]>('/game-sessions/active');
  }
}

export const gameSessionsService = new GameSessionsService();
