import { api } from '../../../services/api';

export class CallesServices {
  static async getAll(params = {}) {
    const { data } = await api.get('/admin/calle', { params });
    return data;
  }

  static async getById(id) {
    const { data } = await api.get(`/admin/calle/${id}`);
    return data;
  }

  static async create(payload) {
    const { data } = await api.post('/admin/calle', payload);
    return data;
  }

  static async update(id, payload) {
    const { data } = await api.patch(`/admin/calle/${id}`, payload);
    return data;
  }

  static async toggleStatus(id) {
    const { data } = await api.patch(`/admin/calle/cambiar-estado/${id}`);
    return data;
  }
}
