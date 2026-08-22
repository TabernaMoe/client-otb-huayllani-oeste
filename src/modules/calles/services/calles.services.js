import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class CallesServices {
 
  static async getAll(page = 1, limit = 10, search = '', estado = '') {
    try {
      const params = {
        page: Math.max(1, Number.parseInt(page, 10) || 1),

        limit: Math.max(1, Number.parseInt(limit, 10) || 10),

        search: String(search || '').trim(),
      };      
      if (estado !== '' && estado !== null && estado !== undefined) {
        params.estado = estado;
      }

      const { data } = await api.get('/admin/calle', {
        params,
      });

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }


  static async getById(id) {
    try {
      const { data } = await api.get(`/admin/calle/${id}`);

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const cleanPayload = {
        nombre_calle: String(payload.nombre_calle || '').trim(),
      };

      const { data } = await api.post('/admin/calle',
        cleanPayload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
  static async update(id, payload) {
    try {
      const cleanPayload = {
        nombre_calle: String(payload.nombre_calle || '').trim(),
      };

      const { data } = await api.patch(
        `/admin/calle/${id}`,
        cleanPayload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

 
  static async toggleStatus(id) {
    try {
      const { data } = await api.patch(
        `/admin/calle/cambiar-estado/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}