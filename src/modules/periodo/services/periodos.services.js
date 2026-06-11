import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class PeriodosServices {
  static async getAll(page = 1, limit = 12, search = '') {
    try {
      const response = await api.get('/admin/gestion/periodo', {
        params: { page, limit, search },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async cerrar(id) {
    try {
      const response = await api.patch(`/admin/gestion/periodo/cerrar/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}