import axios from 'axios';

// Base URL provista por el backend Go - Limpiamos posibles slashes al final
const rawBaseUrl = import.meta.env.VITE_BASE_AUTH || 'http://localhost:8080';
const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar token
axiosInstance.interceptors.request.use(
  (config) => {
    // Evitar duplicación de /gestrym-auth si baseURL ya lo contiene
    if (config.url && config.url.startsWith('/gestrym-auth') && config.baseURL && config.baseURL.endsWith('/gestrym-auth')) {
      config.url = config.url.replace(/^\/gestrym-auth/, '');
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo de refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        // Llamada directa usando axios limpio para evitar loop de interceptores
        const refreshUrl = BASE_URL.endsWith('/gestrym-auth')
          ? `${BASE_URL}/public/auth/refresh`
          : `${BASE_URL}/gestrym-auth/public/auth/refresh`;
        const response = await axios.post(refreshUrl, {
          refresh_token: refreshToken
        });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Falló el refresh, redireccionar al login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
