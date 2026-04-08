import { create } from 'zustand';
import { authApi, LoginRequest } from '../api/auth.endpoints';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  validateSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  token: localStorage.getItem('token'),

  login: async (data: LoginRequest) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(data);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      set({ isAuthenticated: true, token: response.access_token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    const { token } = get();
    if (token) {
      try {
        await authApi.logout(token);
      } catch (error) {
        console.error('Logout request failed', error);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ isAuthenticated: false, token: null });
    window.location.href = '/login';
  },

  validateSession: async () => {
    const { token, logout } = get();
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      await authApi.validate();
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      // Token is invalid or expired
      void logout();
      set({ isLoading: false });
    }
  }
}));
