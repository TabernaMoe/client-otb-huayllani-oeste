import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class TarifasServices {
  static async getAll(page = 1, limit = 5, search = '', estado = true) {
    try {
      const response = await api.get('/admin/tarifa', {
        params: { page, limit, search, estado },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getForSelect(search = '') {
    try {
      const response = await api.get('/admin/tarifa/select', {
        params: { search },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const response = await api.get(`/admin/tarifa/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const response = await api.post('/admin/tarifa', payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const response = await api.patch(`/admin/tarifa/${id}`, payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/admin/tarifa/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async toggleStatus(id) {
    try {
      const response = await api.patch(`/admin/tarifa/toggle-status/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}