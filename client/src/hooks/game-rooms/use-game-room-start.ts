'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameRoomsService } from '../../services/game-rooms.service';
import {
  GET_GAME_ROOMS_QUERY,
  GET_GAME_ROOM_QUERY,
} from '../../queryKeys/game-rooms';
import type { GameRoom } from '../../types/game-rooms';

export function useGameRoomStart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: number) => gameRoomsService.startGame(roomId),
    onSuccess: (updatedRoom: GameRoom) => {
      queryClient.invalidateQueries({ queryKey: GET_GAME_ROOMS_QUERY() });
      queryClient.setQueryData(
        GET_GAME_ROOM_QUERY(updatedRoom.id, true),
        updatedRoom
      );
    },
    onError: (error: Error) => {
      console.error('Failed to start game:', error);
    },
  });
}
