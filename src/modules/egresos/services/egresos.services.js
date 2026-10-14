import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class EgresosServices {
  static async getAll() {
    try {
      const { data } = await api.get('/admin/egresos');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(body) {
    try {
      const { data } = await api.post('/admin/egresos', body);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getCategorias() {
    try {
      const { data } = await api.get('/admin/egresos/categoria-gastos');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async createCategoria(body) {
    try {
      const { data } = await api.post('/admin/egresos/categoria-gastos', body);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
