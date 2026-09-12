import { api } from '../../services/api';

export class InventarioServices {
  static async getAll(params = {}) {
    const { data } = await api.get('/admin/inventario', { params });
    return data;
  }

  static async create(payload) {
    const { data } = await api.post('/admin/inventario', payload);
    return data;
  }

  static async update(id, payload) {
    const { data } = await api.patch(`/admin/inventario/${id}`, payload);
    return data;
  }

  static async sumar(id) {
    const { data } = await api.get(`/admin/inventario/sumar/${id}`);
    return data;
  }

  static async restar(id) {
    const { data } = await api.get(`/admin/inventario/restar/${id}`);
    return data;
  }
}
