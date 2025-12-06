'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsService } from '../../services/cards.service';
import { GET_CARDS_QUERY, GET_CARD_QUERY } from '../../queryKeys/cards';
import type { UpdateCardRequest, Card } from '../../types/cards';

export function useCardUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCardRequest }) =>
      cardsService.update(id, data),
    onSuccess: (updatedCard: Card) => {
      queryClient.invalidateQueries({ queryKey: GET_CARDS_QUERY() });
      queryClient.setQueryData(GET_CARD_QUERY(updatedCard.id), updatedCard);
    },
    onError: (error: Error) => {
      console.error('Failed to update card:', error);
    },
  });
}
