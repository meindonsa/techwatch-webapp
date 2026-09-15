import axios from 'axios';
import { useUserStore } from '@/core/stores/user.ts';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
})

api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const secretToken = import.meta.env.VITE_API_SECRET_TOKEN;
    
    if (secretToken) {
      config.headers['X-App-Token'] = `cs ${secretToken}`;
    }

    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const userStore = useUserStore();

    // 1. On ne tente le refresh QUE si c'est une 401 et que ce n'est pas déjà une tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Sécurité : Si la requête qui a échoué est justement le refresh, on arrête tout
      if (originalRequest.url?.includes('/auth/refresh')) {
        userStore.logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = userStore.refreshToken;
        if (!refreshToken) throw new Error('No refresh token');

        // UTILISATION D'UNE INSTANCE AXIOS NIVEAU ROOT (pas 'api') pour éviter la boucle
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, 
          { refreshToken }, 
          { 
            headers: { 
              'X-App-Token': `cs ${import.meta.env.VITE_API_SECRET_TOKEN}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        const newAccessToken = response.data.accessToken;
        userStore.accessToken = newAccessToken;
        localStorage.setItem('access_token', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        userStore.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
