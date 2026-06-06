import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class CallesServices {
  static async getAll(page = 1, limit = 5, search = '', estado = true) {
    try {
      const response = await api.get('/calle', {
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
      const response = await api.get('/calle/select', {
        params: { search },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const response = await api.get(`/calle/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const response = await api.post('/calle', payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const response = await api.patch(`/calle/${id}`, payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/calle/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async toggleStatus(id) {
    try {
      const response = await api.patch(`/calle/toggle-status/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}