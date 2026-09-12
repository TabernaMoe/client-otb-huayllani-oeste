import { api } from '../../../services/api';

export class DashboardServices {
  static async getSocios(params = {}) {
    const { data } = await api.get('/admin/socio', { params });
    return data;
  }

  static async getAcciones(params = {}) {
    const { data } = await api.get('/admin/accion', { params });
    return data;
  }
}
