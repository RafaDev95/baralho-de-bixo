import { apiClient } from './api-client';
import type {
  Deck,
  CreateDeckRequest,
  UpdateDeckRequest,
} from '../types/decks';

class DecksService {
  async list(includeCards?: boolean): Promise<Deck[]> {
    const params = includeCards ? '?includeCards=true' : '';
    return apiClient.get<Deck[]>(`/decks${params}`);
  }

  async getById(id: number, includeCards?: boolean): Promise<Deck> {
    const params = includeCards ? '?includeCards=true' : '';
    return apiClient.get<Deck>(`/decks/${id}${params}`);
  }

  async create(data: CreateDeckRequest): Promise<Deck> {
    return apiClient.post<Deck>('/decks', data);
  }

  async update(id: number, data: UpdateDeckRequest): Promise<Deck> {
    return apiClient.patch<Deck>(`/decks/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/decks/${id}`);
  }
}

export const decksService = new DecksService();
