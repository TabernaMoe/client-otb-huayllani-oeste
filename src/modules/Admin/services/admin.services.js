import { api } from '../../../services/api';

export class AdminServices {
  static async getRoles() {
    const { data } = await api.get('/admin/persona-admin/rol');
    return data;
  }

  static async getAll(params = {}) {
    const { data } = await api.get('/admin/persona-admin/', { params });
    return data;
  }

  static async getById(id) {
    const { data } = await api.get(`/admin/persona-admin/${id}`);
    return data;
  }

  static async create(payload) {
    const { data } = await api.post('/admin/persona-admin', payload);
    return data;
  }

  static async update(id, payload) {
    const { data } = await api.patch(`/admin/persona-admin/${id}`, payload);
    return data;
  }

  static async toggleStatus(id) {
    const { data } = await api.patch(`/admin/persona-admin/cambiar-estado/${id}`);
    return data;
  }
}
