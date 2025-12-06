'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameRoomsService } from '../../services/game-rooms.service';
import { GET_GAME_ROOMS_QUERY } from '../../queryKeys/game-rooms';
import type { CreateGameRoomRequest, GameRoom } from '../../types/game-rooms';

export function useGameRoomCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGameRoomRequest) => gameRoomsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_GAME_ROOMS_QUERY() });
    },
    onError: (error: Error) => {
      console.error('Failed to create game room:', error);
    },
  });
}
