'use client';

import { useQuery } from '@tanstack/react-query';
import { cardsService } from '../../services/cards.service';
import { GET_CARDS_QUERY } from '../../queryKeys/cards';
import type { Card } from '../../types/cards';

export function useCardsList() {
  return useQuery<Card[]>({
    queryKey: GET_CARDS_QUERY(),
    queryFn: () => cardsService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: () => {
      // Cards list loaded successfully
    },
    onError: (error: Error) => {
      console.error('Failed to fetch cards:', error);
    },
  });
}
