import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class GestionesServices {
  static async getAll(search = '') {
    try {
      const response = await api.get('/gestion', {
        params: {
          search,
        },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const response = await api.post('/gestion', payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/gestion/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}