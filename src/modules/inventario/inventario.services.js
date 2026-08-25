import { api } from '../../services/api';
import { toServiceError } from '../../services/error';

export class InventarioServices {
  static async getAll(params = {}) {
    try {
      const response = await api.get('/admin/inventario', {
        params,
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post('/admin/inventario', payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(`/admin/inventario/${id}`, payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
  static async sumar(id) {
    try {
      const response = await api.get(`/admin/inventario/sumar/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
  static async restar(id) {
    try {
      const response = await api.get(`/admin/inventario/restar/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
