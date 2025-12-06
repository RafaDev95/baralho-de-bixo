'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { decksService } from '../../services/decks.service';
import { GET_DECKS_QUERY, GET_DECK_QUERY } from '../../queryKeys/decks';
import type { UpdateDeckRequest, Deck } from '../../types/decks';

export function useDeckUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeckRequest }) =>
      decksService.update(id, data),
    onSuccess: (updatedDeck: Deck) => {
      queryClient.invalidateQueries({ queryKey: GET_DECKS_QUERY() });
      queryClient.setQueryData(GET_DECK_QUERY(updatedDeck.id), updatedDeck);
    },
    onError: (error: Error) => {
      console.error('Failed to update deck:', error);
    },
  });
}
