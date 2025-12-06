'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameSessionsService } from '../../services/game-sessions.service';
import { GET_ACTIVE_GAMES_QUERY } from '../../queryKeys/game-sessions';
import type { StartGameRequest, GameSession } from '../../types/game-sessions';

export function useGameStart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartGameRequest) => gameSessionsService.startGame(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_ACTIVE_GAMES_QUERY() });
    },
    onError: (error: Error) => {
      console.error('Failed to start game:', error);
    },
  });
}
