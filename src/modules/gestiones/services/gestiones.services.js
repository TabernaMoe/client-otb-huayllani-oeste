import { api } from '../../../services/api';

export class GestionesServices {
  static async getAll(params = {}) {
    const { data } = await api.get('/admin/gestion', { params });
    return data;
  }

  static async getById(id) {
    const { data } = await api.get(`/admin/gestion/${id}`);
    return data;
  }

  static async create(payload) {
    const { data } = await api.post('/admin/gestion', payload);
    return data;
  }
}
