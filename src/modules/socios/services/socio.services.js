import { api } from '../../../services/api';

export class SocioServices {
  static async getAll(params = {}) {
    const { data } = await api.get('/admin/socio', { params });
    return data;
  }

  static async getById(id) {
    const { data } = await api.get(`/admin/socio/${id}`);
    return data;
  }

  static async getDetalle(id) {
    const { data } = await api.get(`/admin/socio/detalle/${id}`);
    return data;
  }

  static async create(payload) {
    const { data } = await api.post('/admin/socio', payload);
    return data;
  }

  static async update(id, payload) {
    const { data } = await api.patch(`/admin/socio/${id}`, payload);
    return data;
  }

  static async changeEstado(id) {
    const { data } = await api.patch(`/admin/socio/cambiar-estado/${id}`);
    return data;
  }
}
