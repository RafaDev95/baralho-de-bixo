'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameSessionsService } from '../../services/game-sessions.service';
import { GET_GAME_STATE_QUERY } from '../../queryKeys/game-sessions';
import type { GameAction } from '../../types/game-sessions';

export function useGameAction(gameId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: GameAction) =>
      gameSessionsService.processGameAction(gameId, action),
    onSuccess: () => {
      // Invalidate game state to refetch after action
      queryClient.invalidateQueries({
        queryKey: GET_GAME_STATE_QUERY(gameId),
      });
    },
    onError: (error: Error) => {
      console.error('Failed to process game action:', error);
    },
  });
}
