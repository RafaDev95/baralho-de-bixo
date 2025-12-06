'use client';

import { useQuery } from '@tanstack/react-query';
import { gameSessionsService } from '../../services/game-sessions.service';
import { GET_ACTIVE_GAMES_QUERY } from '../../queryKeys/game-sessions';
import type { GameSession } from '../../types/game-sessions';

export function useActiveGames() {
  return useQuery<GameSession[]>({
    queryKey: GET_ACTIVE_GAMES_QUERY(),
    queryFn: () => gameSessionsService.getActiveGames(),
    staleTime: 10 * 1000, // 10 seconds
    onSuccess: () => {
      // Active games loaded successfully
    },
    onError: (error: Error) => {
      console.error('Failed to fetch active games:', error);
    },
  });
}
