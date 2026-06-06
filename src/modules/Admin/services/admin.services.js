import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AdminServices {
  static async getAll(page = 1, limit = 5, search = '', estado = true) {
    try {
      const response = await api.get('/auth/usuarios', {
        params: {
          page,
          limit,
          search,
          estado,
        },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const response = await api.get(`/auth/usuarios/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const response = await api.post('/auth/usuarios', payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const response = await api.patch(`/auth/usuarios/${id}`, payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async toggleStatus(id) {
    try {
      const response = await api.patch(`/auth/usuarios/toggle-status/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}