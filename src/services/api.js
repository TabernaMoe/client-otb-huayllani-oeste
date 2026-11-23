import axios from 'axios';
import { normalizeApiError } from './error';

export const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || '',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeApiError(error);
    error.normalized = normalized;
    error.message = normalized.message;

    if (
      error?.response?.data &&
      typeof error.response.data === 'object' &&
      !(error.response.data instanceof Blob)
    ) {
      if (error.response.data.rawMessage === undefined) {
        error.response.data.rawMessage = error.response.data.message;
      }
      error.response.data.message = normalized.message;
      error.response.data.fieldErrors = normalized.fieldErrors;
    }

    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);