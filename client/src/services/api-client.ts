import { env } from '../config/env';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export class ApiClientError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.NEXT_PUBLIC_API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        let errorCode: string | undefined;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorCode = errorData.code;
        } catch {
          // If response is not JSON, use default message
        }

        throw new ApiClientError(errorMessage, errorCode, response.status);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiClientError(error.message, 'NETWORK_ERROR');
      }

      throw new ApiClientError('An unknown error occurred', 'UNKNOWN_ERROR');
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
