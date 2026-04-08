import { axiosInstance } from './axios';

// Interfaces for Requests
export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  phone: string;
  role_id: number;
}

export interface GoogleLoginRequest {
  id_token: string;
}

// Interfaces for Responses
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface MessageResponse {
  message: string;
}

/**
 * Auth API Endpoints
 */
export const authApi = {
  // Public
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    const response = await axiosInstance.post<AuthTokens>('/public/auth/login', data);
    return response.data;
  },
  
  googleLogin: async (data: GoogleLoginRequest): Promise<AuthTokens> => {
    const response = await axiosInstance.post<AuthTokens>('/public/auth/google', data);
    return response.data;
  },
  
  register: async (data: RegisterRequest): Promise<MessageResponse> => {
    const response = await axiosInstance.post<MessageResponse>('/public/auth/register', data);
    return response.data;
  },

  // Private
  validate: async (): Promise<void> => {
    await axiosInstance.get('/private/auth/validate');
  },
  
  logout: async (token: string): Promise<MessageResponse> => {
    const response = await axiosInstance.post<MessageResponse>('/private/auth/logout', { token });
    return response.data;
  }
};
