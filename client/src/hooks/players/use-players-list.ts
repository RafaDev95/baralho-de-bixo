'use client';

import { useQuery } from '@tanstack/react-query';
import { playersService } from '../../services/players.service';
import { GET_PLAYERS_QUERY } from '../../queryKeys/players';
import type { Player } from '../../types/players';

export function usePlayersList() {
  return useQuery<Player[]>({
    queryKey: GET_PLAYERS_QUERY(),
    queryFn: () => playersService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: () => {
      // Players list loaded successfully
    },
    onError: (error: Error) => {
      console.error('Failed to fetch players:', error);
    },
  });
}
