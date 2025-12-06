'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { decksService } from '../../services/decks.service';
import { GET_DECKS_QUERY } from '../../queryKeys/decks';
import type { CreateDeckRequest, Deck } from '../../types/decks';

export function useDeckCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeckRequest) => decksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_DECKS_QUERY() });
    },
    onError: (error: Error) => {
      console.error('Failed to create deck:', error);
    },
  });
}
