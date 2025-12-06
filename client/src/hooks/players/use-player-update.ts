'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playersService } from '../../services/players.service';
import { GET_PLAYERS_QUERY, GET_PLAYER_QUERY } from '../../queryKeys/players';
import type { UpdatePlayerRequest, Player } from '../../types/players';

export function usePlayerUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePlayerRequest }) =>
      playersService.update(id, data),
    onSuccess: (updatedPlayer: Player) => {
      queryClient.invalidateQueries({ queryKey: GET_PLAYERS_QUERY() });
      queryClient.setQueryData(
        GET_PLAYER_QUERY(updatedPlayer.id),
        updatedPlayer
      );
    },
    onError: (error: Error) => {
      console.error('Failed to update player:', error);
    },
  });
}
