import { api } from '../../../services/api';

export class DetalleAccionServices {
  static async getAll(params = {}) {
    const { data } = await api.get('/admin/acciones/agua/detalle', { params });
    return data;
  }

  static async getTiposAccion() {
    const { data } = await api.get('/admin/acciones/agua/detalle/tipos-accion');
    return {
      ...data,
      data: Array.isArray(data?.data) ? data.data : [],
    };
  }

  static async getById(id) {
    const { data } = await api.get(`/admin/acciones/agua/detalle/${id}`);
    const detalle = data?.data ?? data?.dato ?? null;
    return {
      ...data,
      data: detalle ? { id, ...detalle } : null,
      dato: detalle ? { id, ...detalle } : null,
    };
  }

  static async create(payload) {
    const { data } = await api.post('/admin/acciones/agua/detalle', payload);
    return data;
  }

  static async update(id, payload) {
    const { data } = await api.patch(
      `/admin/acciones/agua/detalle/${id}`,
      payload,
    );
    return data;
  }

  static async changeEstado(id) {
    const { data } = await api.patch(
      `/admin/acciones/agua/detalle/change-status/${id}`,
    );
    return data;
  }
}
