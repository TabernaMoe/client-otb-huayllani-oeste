import { api } from '../../../services/api.js';
import { toServiceError } from '../../../services/error.js';

export class CalleRamalServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get(`/acciones/calle-ramal`, {
        params: {
          page,
          limit,
          search,
        },
      });
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const response = await api.get(`/acciones/calle-ramal/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post('/acciones/calle-ramal', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async update(id, payload) {
    try {
      const response = await api.put(`/acciones/calle-ramal/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const response = await api.put(`/acciones/calle-ramal/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
