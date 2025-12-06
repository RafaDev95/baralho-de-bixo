'use client';

import { useQuery } from '@tanstack/react-query';
import { playersService } from '../../services/players.service';
import { GET_PLAYER_QUERY } from '../../queryKeys/players';
import type { Player } from '../../types/players';

export function usePlayerById(id: number) {
  return useQuery<Player>({
    queryKey: GET_PLAYER_QUERY(id),
    queryFn: () => playersService.getById(id),
    enabled: !!id,
    retry: (failureCount, error: { code?: string }) => {
      if (error.code === 'NOT_FOUND') return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: () => {
      // Player loaded successfully
    },
    onError: (error: Error) => {
      console.error('Failed to fetch player:', error);
    },
  });
}
