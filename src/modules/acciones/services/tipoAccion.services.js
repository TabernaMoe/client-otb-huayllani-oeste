import { api } from '../../../services/api.js';
import { toServiceError } from '../../../services/error.js';

export class TipoAccionServices {
  static async getAll(page, limit, search = '') {
    try {
      const response = await api.get(`/acciones/tipo-accion`, {
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
      const response = await api.get(`/acciones/tipo-accion/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post('/acciones/tipo-accion', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async update(id, payload) {
    try {
      const response = await api.put(`/acciones/tipo-accion/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const response = await api.delete(`/acciones/tipo-accion/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
