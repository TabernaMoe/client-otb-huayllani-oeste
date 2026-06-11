import { api } from '../../../services/api.js';
import { toServiceError } from '../../../services/error.js';

export class AccionServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get(`admin/acciones/acciones`, {
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
      const response = await api.get(`admin/acciones/acciones/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post('admin/acciones/acciones', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async update(id, payload) {
    try {
      const response = await api.put(`admin/acciones/acciones/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async disable(id) {
    try {
      const response = await api.put(`admin/acciones/acciones/disable/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
