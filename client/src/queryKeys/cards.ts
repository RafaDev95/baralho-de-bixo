export const CARDS_QUERY_KEYS = {
  all: ['cards'] as const,
  lists: () => [...CARDS_QUERY_KEYS.all, 'list'] as const,
  list: () => [...CARDS_QUERY_KEYS.lists()] as const,
  details: () => [...CARDS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...CARDS_QUERY_KEYS.details(), id] as const,
} as const;

export function GET_CARDS_QUERY() {
  return CARDS_QUERY_KEYS.list();
}

export function GET_CARD_QUERY(id: number) {
  return CARDS_QUERY_KEYS.detail(id);
}

