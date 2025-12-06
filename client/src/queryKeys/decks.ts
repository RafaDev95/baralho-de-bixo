export const DECKS_QUERY_KEYS = {
  all: ['decks'] as const,
  lists: () => [...DECKS_QUERY_KEYS.all, 'list'] as const,
  list: (includeCards?: boolean) =>
    [...DECKS_QUERY_KEYS.lists(), { includeCards }] as const,
  details: () => [...DECKS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number, includeCards?: boolean) =>
    [...DECKS_QUERY_KEYS.details(), id, { includeCards }] as const,
} as const;

export function GET_DECKS_QUERY(includeCards?: boolean) {
  return DECKS_QUERY_KEYS.list(includeCards);
}

export function GET_DECK_QUERY(id: number, includeCards?: boolean) {
  return DECKS_QUERY_KEYS.detail(id, includeCards);
}

