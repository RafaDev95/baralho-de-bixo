export const GAME_ROOMS_QUERY_KEYS = {
  all: ['game-rooms'] as const,
  lists: () => [...GAME_ROOMS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: { status?: string; includePlayers?: boolean }) =>
    [...GAME_ROOMS_QUERY_KEYS.lists(), filters] as const,
  details: () => [...GAME_ROOMS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number, includePlayers?: boolean) =>
    [...GAME_ROOMS_QUERY_KEYS.details(), id, { includePlayers }] as const,
} as const;

export function GET_GAME_ROOMS_QUERY(filters?: {
  status?: string;
  includePlayers?: boolean;
}) {
  return GAME_ROOMS_QUERY_KEYS.list(filters);
}

export function GET_GAME_ROOM_QUERY(id: number, includePlayers?: boolean) {
  return GAME_ROOMS_QUERY_KEYS.detail(id, includePlayers);
}

