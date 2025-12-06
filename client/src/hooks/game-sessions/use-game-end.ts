'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameSessionsService } from '../../services/game-sessions.service';
import { GET_ACTIVE_GAMES_QUERY } from '../../queryKeys/game-sessions';
import type { EndGameRequest } from '../../types/game-sessions';

export function useGameEnd(gameId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: EndGameRequest) =>
      gameSessionsService.endGame(gameId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_ACTIVE_GAMES_QUERY() });
    },
    onError: (error: Error) => {
      console.error('Failed to end game:', error);
    },
  });
}
