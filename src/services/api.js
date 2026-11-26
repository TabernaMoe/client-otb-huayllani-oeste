import axios from 'axios';
import { normalizeApiError } from './error';
import { sessionStorageAdapter } from '../core/storage/sessionStorage';
import { authEvents } from '../core/auth/authEvents';

export const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || '',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorageAdapter.getToken();
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
      sessionStorageAdapter.clear();
      authEvents.emit('unauthorized', {
        url: error?.config?.url || '',
        status: 401,
      });
    }

    return Promise.reject(error);
  },
);