'use client';

import { useQuery } from '@tanstack/react-query';
import { decksService } from '../../services/decks.service';
import { GET_DECK_QUERY } from '../../queryKeys/decks';
import type { Deck } from '../../types/decks';

export function useDeckById(id: number, includeCards?: boolean) {
  return useQuery<Deck>({
    queryKey: GET_DECK_QUERY(id, includeCards),
    queryFn: () => decksService.getById(id, includeCards),
    enabled: !!id,
    retry: (failureCount, error: { code?: string }) => {
      if (error.code === 'NOT_FOUND') return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: () => {
      // Deck loaded successfully
    },
    onError: (error: Error) => {
      console.error('Failed to fetch deck:', error);
    },
  });
}
