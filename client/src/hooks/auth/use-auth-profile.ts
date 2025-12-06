'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';
import { GET_AUTH_PROFILE_QUERY } from '../../queryKeys/auth';
import type { AuthResponse } from '../../types/auth';

export function useAuthProfile(email: string) {
  return useQuery<AuthResponse>({
    queryKey: GET_AUTH_PROFILE_QUERY(email),
    queryFn: () => authService.getProfile(email),
    enabled: !!email,
    retry: (failureCount, error: { code?: string }) => {
      if (error.code === 'NOT_FOUND') return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data: AuthResponse) => {
      if (!data.success) {
        console.error('Failed to fetch profile:', data.error);
      }
    },
    onError: (error: Error) => {
      console.error('Profile fetch error:', error);
    },
  });
}
