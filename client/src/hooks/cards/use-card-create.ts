'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsService } from '../../services/cards.service';
import { GET_CARDS_QUERY } from '../../queryKeys/cards';
import type { CreateCardRequest, Card } from '../../types/cards';

export function useCardCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCardRequest) => cardsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_CARDS_QUERY() });
    },
    onError: (error: Error) => {
      console.error('Failed to create card:', error);
    },
  });
}
