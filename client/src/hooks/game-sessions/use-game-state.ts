'use client';

import { useQuery } from '@tanstack/react-query';
import { gameSessionsService } from '../../services/game-sessions.service';
import { GET_GAME_STATE_QUERY } from '../../queryKeys/game-sessions';
import type { GameState } from '../../types/game-sessions';

export function useGameState(gameId: number) {
  return useQuery<GameState>({
    queryKey: GET_GAME_STATE_QUERY(gameId),
    queryFn: () => gameSessionsService.getGameState(gameId),
    enabled: !!gameId,
    retry: (failureCount, error: { code?: string }) => {
      if (error.code === 'NOT_FOUND') return false;
      return failureCount < 2;
    },
    staleTime: 1 * 1000, // 1 second - game state changes very frequently
    refetchInterval: 2000, // Poll every 2 seconds for game state updates
    onSuccess: () => {
      // Game state loaded successfully
    },
    onError: (error: Error) => {
      console.error('Failed to fetch game state:', error);
    },
  });
}
