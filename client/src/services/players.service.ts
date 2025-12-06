import { apiClient } from './api-client';
import type {
  Player,
  CreatePlayerRequest,
  UpdatePlayerRequest,
} from '../types/players';

class PlayersService {
  async list(): Promise<Player[]> {
    return apiClient.get<Player[]>('/players');
  }

  async getById(id: number): Promise<Player> {
    return apiClient.get<Player>(`/players/${id}`);
  }

  async create(data: CreatePlayerRequest): Promise<Player> {
    return apiClient.post<Player>('/players', data);
  }

  async update(id: number, data: UpdatePlayerRequest): Promise<Player> {
    return apiClient.patch<Player>(`/players/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/players/${id}`);
  }
}

export const playersService = new PlayersService();
