import { api } from '../../services/api';
import { toServiceError } from '../../services/error';

export class TipoAccionServices {
  static async getAll(page, limit, search) {
    try {
      const response = await api.get('/admin/accion/tipo-accion', {
        params: {
          page,
          limit,
          search,
        },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post('/admin/accion/tipo-accion', payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(
        `/admin/accion/tipo-accion/${id}`,
        payload,
      );
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
