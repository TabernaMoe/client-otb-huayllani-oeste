import axios from 'axios';
import { normalizeApiError } from './error';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
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
    error.normalized = normalizeApiError(error);
    return Promise.reject(error);
  },
);
    