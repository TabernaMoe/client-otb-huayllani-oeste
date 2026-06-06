import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class DetalleAccionServices {
  static async getAll(page = 1, limit = 5, search = '', estado = true) {
    try {
      const response = await api.get('/accion/detalle', {
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
      const response = await api.get('/accion/detalle/select', {
        params: { search },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const response = await api.get(`/accion/detalle/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const response = await api.post('/accion/detalle', payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const response = await api.patch(`/accion/detalle/${id}`, payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async toggleStatus(id) {
    try {
      const response = await api.patch(`/accion/detalle/toggle-status/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/accion/detalle/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}