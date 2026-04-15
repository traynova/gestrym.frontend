import { apiClient } from './axios.config';
import { handleApiError } from '../lib/errors/errorHandler';

// ----------------------------------------------------------------------
// TYPES AND INTERFACES
// ----------------------------------------------------------------------

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  role_id: number;
  email: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  prefix: string;
  phone: string;
  role_id: number;
  registration_source: 'self' | 'gym' | 'trainer';
  source_id?: number;
  city?: string;
  department?: string;
  country?: string;
  workstation?: string;
  primary_color?: string;
  secondary_color?: string;
  referral_code?: string;
  avatar_file_id?: number;
}

export interface ValidateResponse {
  valid: boolean;
  user_id: number;
  role_id: number;
  access_level_id?: number;
  email: string;
  expires_at: number;
}

export interface ConfirmEmailResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    role_id: number;
    is_active: boolean;
    email_confirmed: boolean;
    [key: string]: any;
  };
}

// ----------------------------------------------------------------------
// AUTH SERVICE
// ----------------------------------------------------------------------

export const authService = {
  
  /**
   * Loguea a un usuario utilizando email y contraseña.
   * Retorna los datos de acceso (incluyendo access_token).
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const { data } = await apiClient.post<LoginResponse>('/public/login', credentials);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Registra un nuevo usuario en la plataforma.
   * Devuelve un token temporal de registro, y pone al usuario en estado inactivo.
   */
  register: async (registerData: RegisterData): Promise<{ id: number, token: string }> => {
    try {
      const { data } = await apiClient.post('/public/auth/register', registerData);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Valida la salud y legitimidad del token actual guardado.
   * Hace uso del Interceptor silencioso que inyecta automáticamente el token.
   */
  validateToken: async (): Promise<ValidateResponse> => {
    try {
      const { data } = await apiClient.get<ValidateResponse>('/public/auth/validate');
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Endpoint de acceso público que recibe el token desde el email para activar la cuenta.
   */
  confirmEmail: async (token: string): Promise<ConfirmEmailResponse> => {
    try {
      const { data } = await apiClient.get<ConfirmEmailResponse>(`/public/auth/confirm?token=${token}`);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  }

};

