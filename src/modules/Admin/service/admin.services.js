import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AdminServices {
  static async getAll(page = 1, limit = 5, search = '') {
    try {
      const response = await api.get('/usuarios', {
        params: { page, limit, search },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const response = await api.post('/usuarios', payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const response = await api.patch(`/usuarios/${id}`, payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}