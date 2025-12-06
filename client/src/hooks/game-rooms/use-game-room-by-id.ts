'use client';

import { useQuery } from '@tanstack/react-query';
import { gameRoomsService } from '../../services/game-rooms.service';
import { GET_GAME_ROOM_QUERY } from '../../queryKeys/game-rooms';
import type { GameRoom } from '../../types/game-rooms';

export function useGameRoomById(id: number, includePlayers?: boolean) {
  return useQuery<GameRoom>({
    queryKey: GET_GAME_ROOM_QUERY(id, includePlayers),
    queryFn: () => gameRoomsService.getById(id, includePlayers),
    enabled: !!id,
    retry: (failureCount, error: { code?: string }) => {
      if (error.code === 'NOT_FOUND') return false;
      return failureCount < 2;
    },
    staleTime: 5 * 1000, // 5 seconds - room state changes frequently
    refetchInterval: 5000, // Poll every 5 seconds for room updates
    onSuccess: () => {
      // Game room loaded successfully
    },
    onError: (error: Error) => {
      console.error('Failed to fetch game room:', error);
    },
  });
}
