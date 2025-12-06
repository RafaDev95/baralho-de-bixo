'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { decksService } from '../../services/decks.service';
import { GET_DECKS_QUERY } from '../../queryKeys/decks';

export function useDeckDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => decksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_DECKS_QUERY() });
    },
    onError: (error: Error) => {
      console.error('Failed to delete deck:', error);
    },
  });
}
