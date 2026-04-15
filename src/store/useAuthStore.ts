import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Asumimos que authService se creará en el siguiente paso
import { authService, type LoginCredentials } from '../api/authService';

// Tipos base para el User y el estado de Autenticación
export interface User {
  email: string;
  role_id: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  loginAction: (credentials: LoginCredentials) => Promise<void>;
  logoutAction: () => void;
  checkSession: () => Promise<void>;
}

/**
 * Store global de Autenticación mediante Zustand.
 * Mantiene el estado del usuario logueado en memoria y lo sincroniza con `localStorage`.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * Inicia sesión, guarda credenciales en memoria, y el middleware Persist lo hace en localStorage.
       */
      loginAction: async (credentials) => {
        try {
          set({ isLoading: true });

          // Llama al servicio de API real
          const data = await authService.login(credentials);

          set({
            user: { email: data.email, role_id: data.role_id },
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error; // Lanzamos el error para que el UI pueda mostrar un mensaje
        }
      },

      /**
       * Limpia por completo el estado y cierra la sesión.
       * Esto resuelve estáticamente el error en `axios.config.ts`.
       */
      logoutAction: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      /**
       * Verifica si el token actual sigue siendo válido en el backend (útil en recargas / F5).
       * Si no es válido o falla, limpia la sesión automáticamente.
       */
      checkSession: async () => {
        const { token, logoutAction } = get();
        
        // Si no tenemos token almacenado, no tiene sentido validar.
        if (!token) return;

        try {
          set({ isLoading: true });
          
          const response = await authService.validateToken();
          
          if (!response.valid) {
            logoutAction(); // Si el backend responde explícitamente invalidando el session
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
           // Cualquier fallo HTTP (401, timeout) durante la validación purga la sesión por seguridad
           logoutAction();
        }
      },
    }),
    {
      name: 'gestrym-auth-storage', // Key de localStorage
      
      // Controla exactamente qué propiedades persistir para obviar isLoading (así no "cuelga" en refresh)
      partialize: (state: AuthState) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
