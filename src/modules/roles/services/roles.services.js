import { api } from '../../../services/api';

export class RolesServices {
  static async getAllPermisos() {
    const { data } = await api.get('/admin/auth/roles/permisos');
    return data;
  }

  static async getAllRoles(params = {}) {
    const { data } = await api.get('/admin/auth/roles', { params });
    return data;
  }

  static async getById(id) {
    const { data } = await api.get(`/admin/auth/roles/${id}`);
    return data;
  }

  static async create(payload) {
    const { data } = await api.post('/admin/auth/roles', payload);
    return data;
  }

  static async update(id, payload) {
    const { data } = await api.patch(`/admin/auth/roles/${id}`, payload);
    return data;
  }
}
