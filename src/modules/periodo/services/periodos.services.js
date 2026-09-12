import { api } from '../../../services/api';

export class PeriodosServices {
  static async getAll(params = {}) {
    const { data } = await api.get('/admin/gestion/periodo', { params });
    return data;
  }

  static async cerrar(id) {
    const { data } = await api.patch(`/admin/gestion/periodo/cerrar/${id}`);
    return data;
  }
}
