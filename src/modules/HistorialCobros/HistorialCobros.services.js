import { api } from '../../services/api';
import { toServiceError } from '../../services/error';

export class HistorialCobrosServices {
  static async getHitorialGeneral(page, limit, search = '') {
    try {
      const response = await api.get('/admin/cobro/historial', {
        params: {
          page,
          limit,
          search,
        },
      });
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async getHitorialPorAccion(page, limit, search = '') {
    try {
      const response = await api.get('/admin/cobro/acciones', {
        params: {
          page,
          limit,
          search,
        },
      });
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getHitorialAccion(id, page, limit, search = '') {
    try {
      const response = await api.get(`/admin/cobro/accion-historial/${id}`, {
        params: {
          page,
          limit,
          search,
        },
      });
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
