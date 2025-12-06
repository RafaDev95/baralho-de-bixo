import { apiClient } from './api-client';
import type { AuthResponse, SignInRequest, SignUpRequest } from '../types/auth';

class AuthService {
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/signup', data);
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/signin', data);
  }

  async getProfile(email: string): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>(
      `/auth/profile/${encodeURIComponent(email)}`
    );
  }
}

export const authService = new AuthService();
