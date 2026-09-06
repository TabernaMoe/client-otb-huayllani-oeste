import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';
export class services {
  static async getAll(page = 1, limit = 10, search = '') {
    try {
      const response = await api.get('/admin/asamblea', {
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
  static async getAcciones(id) {
    try {
      const response = await api.get(`/admin/asamblea/acciones/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const response = await api.get(`/admin/asamblea/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post(`/admin/asamblea`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(`/admin/asamblea/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async updateAcciones(id, payload) {
    try {
      const response = await api.patch(`/admin/asamblea/accion/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
