// lib/api.ts
import axios from 'axios';

const getBaseUrl = () =>
  window.__APP_CONFIG__?.API_URL ||
  import.meta.env.VITE_API_URL ||
  'https://api.lankapasstravel.com';

// Create axios instance
export const api = axios.create({
  //  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseUrl();
    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Dispatch global event for session timeout on 401/403, except for login attempts and password reset attempts
    const isAuthEndpoint = error.config?.url?.includes('/login') ||
      error.config?.url?.includes('/forgot-password') ||
      error.config?.url?.includes('/change-password');

    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthEndpoint) {
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
    }

    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);
