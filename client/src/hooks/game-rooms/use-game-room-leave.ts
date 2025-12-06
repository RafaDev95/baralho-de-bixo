'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameRoomsService } from '../../services/game-rooms.service';
import {
  GET_GAME_ROOMS_QUERY,
  GET_GAME_ROOM_QUERY,
} from '../../queryKeys/game-rooms';

export function useGameRoomLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, playerId }: { roomId: number; playerId: number }) =>
      gameRoomsService.leave(roomId, playerId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: GET_GAME_ROOMS_QUERY() });
      queryClient.invalidateQueries({
        queryKey: GET_GAME_ROOM_QUERY(variables.roomId, true),
      });
    },
    onError: (error: Error) => {
      console.error('Failed to leave game room:', error);
    },
  });
}
