export const AUTH_QUERY_KEYS = {
  all: ['auth'] as const,
  profile: (email: string) => ['auth', 'profile', email] as const,
} as const;

export function GET_AUTH_PROFILE_QUERY(email: string) {
  return AUTH_QUERY_KEYS.profile(email);
}

