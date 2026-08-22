import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class PeriodosServices {

  static async getAll(page = 1, limit = 10) {
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
      };

      const { data } = await api.get(
        '/admin/gestion/periodo',
        {
          params,
        },
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }


  static async cerrar(id) {
    try {
      const { data } = await api.patch(
        `/admin/gestion/periodo/cerrar/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}