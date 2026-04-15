import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const BASE_AUTH = import.meta.env.VITE_BASE_AUTH || 'http://localhost:8080/api';

if (!import.meta.env.VITE_BASE_AUTH) {
  console.warn("⚠️ Warning: VITE_BASE_AUTH no está definida en tu archivo .env. Usando fallback por defecto.");
}

/**
 * Instancia centralizada de Axios para realizar todas las llamadas al API.
 * Configurada con la URL base, headers genéricos y un timeout de 10 segundos.
 */
export const apiClient = axios.create({
  baseURL: BASE_AUTH,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * INTERCEPTOR DE REQUEST
 * Se ejecuta antes de que se envíe cada petición al backend.
 * Obtiene el token de la sesión desde el estado de Zustand e inyecta el Header Authorization.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Obtenemos el estado actual de Zustand sin usar hooks dentro de una función regular
    const { token } = useAuthStore.getState();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Si hay un error al configurar la request, lo rechazamos inmediatamente
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTOR DE RESPONSE
 * Se ejecuta en las respuestas del backend antes de que lleguen al componente o servicio que las llamó.
 * Diseñado para detectar errores del tipo 401 (No Autorizado) para limpiar el estado y desloguear.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa (200-299), simplemente la retornamos
    return response;
  },
  (error) => {
    // Si Axios recibe un error (fuera del rango 2xx)
    if (error.response) {
      const status = error.response.status;

      // Si el backend devuelve un 401, significa que el token expiró o es inválido
      if (status === 401) {
        // Ejecutamos la acción de logout definida en el estado global
        useAuthStore.getState().logoutAction();
        
        // Si usamos 'react-router-dom', también podríamos forzar una redirección
        // window.location.href = '/login'; -> Opcionable según qué maneje el enrutador
      }
    }
    
    return Promise.reject(error);
  }
);
