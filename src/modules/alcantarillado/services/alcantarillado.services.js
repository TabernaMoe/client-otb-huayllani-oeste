import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AlcantarilladoServices {
  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/acciones/alcantarillado/detalle', {
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
        '/admin/acciones/alcantarillado/detalle',
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const { data } = await api.patch(
        `/admin/acciones/alcantarillado/detalle/${id}`,
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async changeEstado(id) {
    try {
      const { data } = await api.patch(
        `/admin/acciones/alcantarillado/detalle/change-status/${id}`,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
