import { api } from '../../services/api';
import { toServiceError } from '../../services/error';

export class TipoAccionServices {

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
        '/admin/accion/tipo-accion',
        {
          params,
        },
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }


  static async create(payload) {
    try {
      const cleanPayload = {
        nombre_tipo_accion: String(
          payload.nombre_tipo_accion || '',
        ).trim(),
      };

      const { data } = await api.post(
        '/admin/accion/tipo-accion',
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
        nombre_tipo_accion: String(
          payload.nombre_tipo_accion || '',
        ).trim(),
      };

      const { data } = await api.patch(
        `/admin/accion/tipo-accion/${id}`,
        cleanPayload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}