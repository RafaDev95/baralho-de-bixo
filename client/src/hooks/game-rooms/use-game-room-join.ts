'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameRoomsService } from '../../services/game-rooms.service';
import {
  GET_GAME_ROOMS_QUERY,
  GET_GAME_ROOM_QUERY,
} from '../../queryKeys/game-rooms';
import type { JoinRoomRequest, GameRoomPlayer } from '../../types/game-rooms';

export function useGameRoomJoin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, data }: { roomId: number; data: JoinRoomRequest }) =>
      gameRoomsService.join(roomId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: GET_GAME_ROOMS_QUERY() });
      queryClient.invalidateQueries({
        queryKey: GET_GAME_ROOM_QUERY(variables.roomId, true),
      });
    },
    onError: (error: Error) => {
      console.error('Failed to join game room:', error);
    },
  });
}
