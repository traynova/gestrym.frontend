import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Asumimos que authService se creará en el siguiente paso
import { authService, type LoginCredentials } from '../api/authService';

// Tipos base para el User y el estado de Autenticación
export interface User {
  id: number;
  email: string;
  role_id: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  loginAction: (credentials: LoginCredentials) => Promise<boolean>;
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
            user: { 
              id: data.id, 
              email: data.email, 
              role_id: data.role_id 
            },
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          return data.initial_login; // Retornamos el flag para el componente
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
        
        if (!token) return;

        try {
          const response = await authService.validateToken();
          
          if (response && response.valid === false) {
            logoutAction();
          } else if (response && response.valid) {
            set({ 
              user: { 
                id: response.user_id, 
                email: response.email, 
                role_id: response.role_id 
              },
              isLoading: false 
            });
          }
        } catch (error) {
          // No cerramos sesión por errores de red o 500, dejamos que los interceptores de Axios
          // manejen los 401 si realmente el token no sirve.
          console.error("Token validation failed, but keeping session for now:", error);
        } finally {
          set({ isLoading: false });
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
