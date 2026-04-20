import { apiClient } from './axios.config';

// Interfaces for Requests
export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password?: string;
  prefix: string;
  phone: string;
  role_id: number;
  registration_source: string;
  city?: string;
  department?: string;
  country?: string;
  referral_code?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface GoogleLoginRequest {
  id_token: string;
}

// Interfaces for Responses
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  initial_login: boolean;
}

export interface MessageResponse {
  message: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  prefix: string;
  role_id: number;
  role_name: string;
  is_active: boolean;
  email_confirmed: boolean;
  collection_id: string;
}

export interface ConfirmEmailResponse {
  message: string;
  user: User;
}

export interface PasswordRecoveryRequest {
  email: string;
}

export interface PasswordResetRequest {
  token: string;
  password?: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface GymClientRelation {
  trainer_id: number;
  trainer_name: string;
  trainer_email: string;
  clients: Client[];
}

export interface RelationshipResponse {
  independent_clients: Client[];
  gym_clients: GymClientRelation[];
}

/**
 * Auth API Endpoints
 */
export const authApi = {
  // Public
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>('/gestrym-auth/public/auth/login', data);
    return response.data;
  },

  googleLogin: async (data: GoogleLoginRequest): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>('/gestrym-auth/public/auth/google', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/gestrym-auth/public/auth/register', data);
    return response.data;
  },

  confirmEmail: async (token: string): Promise<ConfirmEmailResponse> => {
    const response = await apiClient.get<ConfirmEmailResponse>(`/gestrym-auth/public/auth/confirm?token=${token}`);
    return response.data;
  },

  requestPasswordRecovery: async (data: PasswordRecoveryRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/gestrym-auth/public/auth/password/recovery', data);
    return response.data;
  },

  resetPassword: async (data: PasswordResetRequest): Promise<ConfirmEmailResponse> => {
    const response = await apiClient.post<ConfirmEmailResponse>('/gestrym-auth/public/auth/password/reset', data);
    return response.data;
  },

  // Private
  validate: async (): Promise<void> => {
    await apiClient.get('/gestrym-auth/private/auth/validate');
  },

  logout: async (token: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/gestrym-auth/private/auth/logout', { token });
    return response.data;
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get<Role[]>('/gestrym-auth/public/roles');
    return response.data;
  },

  getRelationships: async (): Promise<RelationshipResponse> => {
    const response = await apiClient.get<RelationshipResponse>('/gestrym-auth/private/auth/relationships');
    return response.data;
  },

  updateBranding: async (formData: FormData): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/gestrym-auth/private/auth/branding', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
