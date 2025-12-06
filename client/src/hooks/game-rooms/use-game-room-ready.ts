'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameRoomsService } from '../../services/game-rooms.service';
import { GET_GAME_ROOM_QUERY } from '../../queryKeys/game-rooms';
import type {
  UpdateReadyStatusRequest,
  GameRoomPlayer,
} from '../../types/game-rooms';

export function useGameRoomReady() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      data,
    }: {
      roomId: number;
      data: UpdateReadyStatusRequest;
    }) => gameRoomsService.updateReadyStatus(roomId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: GET_GAME_ROOM_QUERY(variables.roomId, true),
      });
    },
    onError: (error: Error) => {
      console.error('Failed to update ready status:', error);
    },
  });
}
