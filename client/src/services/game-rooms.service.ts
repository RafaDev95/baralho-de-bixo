import { apiClient } from './api-client';
import type {
  GameRoom,
  CreateGameRoomRequest,
  JoinRoomRequest,
  UpdateReadyStatusRequest,
  GameRoomPlayer,
} from '../types/game-rooms';

class GameRoomsService {
  async list(filters?: {
    status?: string;
    includePlayers?: boolean;
  }): Promise<GameRoom[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.includePlayers) params.append('includePlayers', 'true');
    const queryString = params.toString();
    return apiClient.get<GameRoom[]>(
      `/game-rooms${queryString ? `?${queryString}` : ''}`
    );
  }

  async getById(id: number, includePlayers?: boolean): Promise<GameRoom> {
    const params = includePlayers ? '?includePlayers=true' : '';
    return apiClient.get<GameRoom>(`/game-rooms/${id}${params}`);
  }

  async create(data: CreateGameRoomRequest): Promise<GameRoom> {
    return apiClient.post<GameRoom>('/game-rooms', data);
  }

  async join(id: number, data: JoinRoomRequest): Promise<GameRoomPlayer> {
    return apiClient.post<GameRoomPlayer>(`/game-rooms/${id}/join`, data);
  }

  async leave(id: number, playerId: number): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/game-rooms/${id}/leave`, {
      playerId,
    });
  }

  async updateReadyStatus(
    id: number,
    data: UpdateReadyStatusRequest
  ): Promise<GameRoomPlayer> {
    return apiClient.patch<GameRoomPlayer>(`/game-rooms/${id}/ready`, data);
  }

  async startGame(id: number): Promise<GameRoom> {
    return apiClient.post<GameRoom>(`/game-rooms/${id}/start`);
  }
}

export const gameRoomsService = new GameRoomsService();
