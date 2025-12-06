import { apiClient } from './api-client';
import type {
  Card,
  CreateCardRequest,
  UpdateCardRequest,
} from '../types/cards';

class CardsService {
  async list(): Promise<Card[]> {
    return apiClient.get<Card[]>('/cards');
  }

  async getById(id: number): Promise<Card> {
    return apiClient.get<Card>(`/cards/${id}`);
  }

  async create(data: CreateCardRequest): Promise<Card> {
    return apiClient.post<Card>('/cards', data);
  }

  async update(id: number, data: UpdateCardRequest): Promise<Card> {
    return apiClient.patch<Card>(`/cards/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/cards/${id}`);
  }
}

export const cardsService = new CardsService();
