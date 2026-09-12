import { api } from '../../../services/api';

export class ReportesServices {
  static async getCobros(params) {
    const { data } = await api.get('/admin/cobro/historial', { params });
    return data;
  }

  static async getAcciones(params) {
    const { data } = await api.get('/admin/cobro/acciones', { params });
    return data;
  }

  static async getHistorialAccion(id, params) {
    const { data } = await api.get(`/admin/cobro/accion-historial/${id}`, {
      params,
    });
    return data;
  }
}
