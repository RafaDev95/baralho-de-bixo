export const PLAYERS_QUERY_KEYS = {
  all: ['players'] as const,
  lists: () => [...PLAYERS_QUERY_KEYS.all, 'list'] as const,
  list: () => [...PLAYERS_QUERY_KEYS.lists()] as const,
  details: () => [...PLAYERS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PLAYERS_QUERY_KEYS.details(), id] as const,
} as const;

export function GET_PLAYERS_QUERY() {
  return PLAYERS_QUERY_KEYS.list();
}

export function GET_PLAYER_QUERY(id: number) {
  return PLAYERS_QUERY_KEYS.detail(id);
}

