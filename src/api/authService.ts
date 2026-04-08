import { axiosInstance } from './axios';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: any;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/public/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/public/auth/register', data);
    return response.data;
  },

  googleLogin: async (token: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/public/auth/google', { token });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/private/auth/logout');
  },
  
  validate: async (): Promise<any> => {
    const response = await axiosInstance.get('/private/auth/validate');
    return response.data;
  }
};
