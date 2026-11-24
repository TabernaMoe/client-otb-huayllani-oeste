import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AdelantoPagosServices {
  static async getAccionesPasivas(params = {}) {
    try {
      const { data } = await api.get('/admin/cobro/acciones-pasivas', {
        params,
      });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
