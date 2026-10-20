import { api } from '../../services/api';
import { toServiceError } from '../../services/error';

export class ReciboMadreSerivices {
  static async create({ payload }) {
    try {
      const response = await api.post('/admin/recibo-universal', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSelectAccion() {
    try {
      const response = await api.get('/admin/recibo-universal/accion');
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
