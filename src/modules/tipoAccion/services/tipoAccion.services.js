import { api } from '../../../services/api';

export class TipoAccionServices {
  static async getAll(params = {}) {
    const { data } = await api.get('/admin/accion/tipo-accion', { params });
    return data;
  }

  static async create(payload) {
    const { data } = await api.post('/admin/accion/tipo-accion', payload);
    return data;
  }

  static async update(id, payload) {
    const { data } = await api.patch(`/admin/accion/tipo-accion/${id}`, payload);
    return data;
  }
}
