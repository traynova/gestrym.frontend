import axios from 'axios';
import { ApiError } from './apiError';

/**
 * Procesa cualquier tipo de error capturado (especialmente de Axios)
 * y lanza siempre una instancia estandarizada de ApiError o detiene la ejecución (never).
 */
export const handleApiError = (error: unknown): never => {
  // 1. Detectar sí el error originó explícitamente desde Axios
  if (axios.isAxiosError(error)) {
    // Escenario A: Hubo conexión, pero el servidor retornó un código de error (4xx, 5xx)
    if (error.response) {
      const { data, status } = error.response;
      let message = 'Ocurrió un error en el servidor o la solicitud fue rechazada.';

      // Extraer de forma segura el mensaje dependiendo la estructura devuelta
      if (typeof data === 'string' && data.length > 0) {
        message = data;
      } else if (data && typeof data === 'object') {
        message = (data as any).message || (data as any).error || message;
      }

      throw new ApiError(message, status);
    }

    // Escenario B: La solicitud fue enviada pero no hubo respuesta del servidor
    if (error.request) {
      throw new ApiError('No se pudo establecer conexión con el servidor. Por favor, verifica tu red.');
    }
  }

  // 2. Errores desconocidos (lógica de frontend fallando antes de enviar petición, bugs, etc.)
  const defaultMessage = error instanceof Error ? error.message : 'Error interno desconocido.';
  throw new ApiError(defaultMessage);
};
