import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class LecturasServices {
  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/lectura', { params });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(accionId) {
    try {
      const { data } = await api.get(`/admin/lectura/${accionId}`);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(accionId, payload) {
    try {
      const { data } = await api.post(`/admin/lectura/${accionId}`, payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(accionId, payload) {
    try {
      const { data } = await api.patch(`/admin/lectura/${accionId}`, payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async cambioMedidor(accionId, payload) {
    try {
      const { data } = await api.patch(`/admin/lectura/cambio/${accionId}`, payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
