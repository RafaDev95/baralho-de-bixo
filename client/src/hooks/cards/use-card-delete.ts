'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsService } from '../../services/cards.service';
import { GET_CARDS_QUERY } from '../../queryKeys/cards';

export function useCardDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cardsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_CARDS_QUERY() });
    },
    onError: (error: Error) => {
      console.error('Failed to delete card:', error);
    },
  });
}
