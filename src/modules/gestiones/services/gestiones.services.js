import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class GestionesServices {

  static async getAll(page = 1, limit = 10, search = '') {
    try {
      const params = {
        page: Math.max(
          1,
          Number.parseInt(page, 10) || 1,
        ),

        limit: Math.max(
          1,
          Number.parseInt(limit, 10) || 10,
        ),

        search: String(search || '').trim(),
      };

      const { data } = await api.get(
        '/admin/gestion',
        {
          params,
        },
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const { data } = await api.get(
        `/admin/gestion/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const cleanPayload = {
        anio: Number(payload.anio),
      };

      const { data } = await api.post(
        '/admin/gestion',
        cleanPayload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}