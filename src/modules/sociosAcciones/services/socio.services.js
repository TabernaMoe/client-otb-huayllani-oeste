import { api } from '../../../services/api.js';
import { toServiceError } from '../../../services/error.js';

export class SocioServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get(`/socios`, {
        params: {
          page,
          limit,
          search,
        },
      });
      console.log(response);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const response = await api.get(`/socios/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post('/socios', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async update(id, payload) {
    try {
      const response = await api.patch(`/socios/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const response = await api.delete(`/socios/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
