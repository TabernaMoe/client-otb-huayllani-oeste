import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class CambioNombreServices {
  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/cambio-nombre', { params });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getAcciones() {
    try {
      const { data } = await api.get('/admin/cambio-nombre/acciones');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getSocios() {
    try {
      const { data } = await api.get('/admin/cambio-nombre/socios');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const { data } = await api.post('/admin/cambio-nombre', payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
