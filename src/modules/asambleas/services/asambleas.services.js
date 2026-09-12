import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AsambleasServices {
  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/asamblea', { params });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const { data } = await api.post('/admin/asamblea', payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const { data } = await api.patch(`/admin/asamblea/${id}`, payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getAcciones(asambleaId) {
    try {
      const { data } = await api.get(`/admin/asamblea/acciones/${asambleaId}`);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async updateAsistencia(id, payload) {
    try {
      const { data } = await api.patch(`/admin/asamblea/accion/${id}`, payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
