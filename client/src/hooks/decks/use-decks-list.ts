'use client';

import { useQuery } from '@tanstack/react-query';
import { decksService } from '../../services/decks.service';
import { GET_DECKS_QUERY } from '../../queryKeys/decks';
import type { Deck } from '../../types/decks';

export function useDecksList(includeCards?: boolean) {
  return useQuery<Deck[]>({
    queryKey: GET_DECKS_QUERY(includeCards),
    queryFn: () => decksService.list(includeCards),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: () => {
      // Decks list loaded successfully
    },
    onError: (error: Error) => {
      console.error('Failed to fetch decks:', error);
    },
  });
}
