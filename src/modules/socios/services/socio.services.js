import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class SocioServices {
  static async getAll(page = 1, limit = 5, search = '', estado = true) {
    try {
      const response = await api.get('/admin/socio', {
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

  static async getForSelect(search = '') {
    try {
      const response = await api.get('/admin/socio/select', {
        params: { search },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const response = await api.get(`/admin/socio/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const response = await api.post('/admin/socio', payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const response = await api.patch(`/admin/socio/${id}`, payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async toggleStatus(id) {
    try {
      const response = await api.patch(`/admin/socio/toggle-status/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}