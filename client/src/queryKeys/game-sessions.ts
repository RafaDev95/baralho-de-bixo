export const GAME_SESSIONS_QUERY_KEYS = {
  all: ['game-sessions'] as const,
  active: () => [...GAME_SESSIONS_QUERY_KEYS.all, 'active'] as const,
  details: () => [...GAME_SESSIONS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...GAME_SESSIONS_QUERY_KEYS.details(), id] as const,
  state: (id: number) => [...GAME_SESSIONS_QUERY_KEYS.detail(id), 'state'] as const,
} as const;

export function GET_ACTIVE_GAMES_QUERY() {
  return GAME_SESSIONS_QUERY_KEYS.active();
}

export function GET_GAME_STATE_QUERY(gameId: number) {
  return GAME_SESSIONS_QUERY_KEYS.state(gameId);
}

