'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';
import { GET_AUTH_PROFILE_QUERY } from '../../queryKeys/auth';
import { useAuth } from '../../contexts/auth-context';
import type { SignInRequest, AuthResponse } from '../../types/auth';

export function useAuthSignIn() {
  const queryClient = useQueryClient();
  const { setPlayer } = useAuth();

  return useMutation({
    mutationFn: (data: SignInRequest) => authService.signIn(data),
    onSuccess: (response: AuthResponse) => {
      if (response.success && response.player) {
        setPlayer(response.player);
        queryClient.setQueryData(
          GET_AUTH_PROFILE_QUERY(response.player.email),
          response
        );
      }
    },
    onError: (error: Error) => {
      console.error('Sign in error:', error);
    },
  });
}
