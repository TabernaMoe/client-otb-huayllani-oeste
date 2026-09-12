import { api } from '../../../services/api';

export class TarifasServices {
  static async getAll(params = {}) {
    const { data } = await api.get('/admin/tarifa', { params });
    return data;
  }

  static async getById(id) {
    const { data } = await api.get(`/admin/tarifa/${id}`);
    return data;
  }

  static async create(payload) {
    const { data } = await api.post('/admin/tarifa', payload);
    return data;
  }

  static async update(id, payload) {
    const { data } = await api.patch(`/admin/tarifa/${id}`, payload);
    return data;
  }

  static async changeEstado(id) {
    const { data } = await api.patch(`/admin/tarifa/cambiar-estado/${id}`);
    return data;
  }
}
