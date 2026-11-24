import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class TipoAccionServices {
  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/acciones/agua/tipo-accion', {
        params,
      });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const { data } = await api.post(
        '/admin/acciones/agua/tipo-accion',
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const { data } = await api.put(
        `/admin/acciones/agua/tipo-accion/${id}`,
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
