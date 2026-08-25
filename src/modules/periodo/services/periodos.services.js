import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class PeriodosServices {

  static async getAll(params = {}) {
    try { 
      const { data } = await api.get(
        '/admin/gestion/periodo',
        {
          params,
        }
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