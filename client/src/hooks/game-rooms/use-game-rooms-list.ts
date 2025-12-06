'use client';

import { useQuery } from '@tanstack/react-query';
import { gameRoomsService } from '../../services/game-rooms.service';
import { GET_GAME_ROOMS_QUERY } from '../../queryKeys/game-rooms';
import type { GameRoom } from '../../types/game-rooms';

export function useGameRoomsList(filters?: {
  status?: string;
  includePlayers?: boolean;
}) {
  return useQuery<GameRoom[]>({
    queryKey: GET_GAME_ROOMS_QUERY(filters),
    queryFn: () => gameRoomsService.list(filters),
    staleTime: 10 * 1000, // 10 seconds - rooms change frequently
    onSuccess: () => {
      // Game rooms list loaded successfully
    },
    onError: (error: Error) => {
      console.error('Failed to fetch game rooms:', error);
    },
  });
}
