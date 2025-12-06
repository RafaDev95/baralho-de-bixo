'use client';

import { useQuery } from '@tanstack/react-query';
import { cardsService } from '../../services/cards.service';
import { GET_CARD_QUERY } from '../../queryKeys/cards';
import type { Card } from '../../types/cards';

export function useCardById(id: number) {
  return useQuery<Card>({
    queryKey: GET_CARD_QUERY(id),
    queryFn: () => cardsService.getById(id),
    enabled: !!id,
    retry: (failureCount, error: { code?: string }) => {
      if (error.code === 'NOT_FOUND') return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: () => {
      // Card loaded successfully
    },
    onError: (error: Error) => {
      console.error('Failed to fetch card:', error);
    },
  });
}
