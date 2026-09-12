import { api } from '../../../services/api';

export class DetalleAccionServices {
  static async getAll(params = {}) {
    const { data } = await api.get('/admin/accion/detalle', { params });
    return data;
  }

  static async getTiposAccion() {
    const { data } = await api.get('/admin/accion/detalle/tipos-accion');
    return data;
  }

  static async getById(id) {
    const { data } = await api.get(`/admin/accion/detalle/${id}`);
    return data;
  }

  static async create(payload) {
    const { data } = await api.post('/admin/accion/detalle', payload);
    return data;
  }

  static async update(id, payload) {
    const { data } = await api.patch(`/admin/accion/detalle/${id}`, payload);
    return data;
  }

  static async changeEstado(id) {
    const { data } = await api.patch(`/admin/accion/detalle/cambiar-estado/${id}`);
    return data;
  }
}
