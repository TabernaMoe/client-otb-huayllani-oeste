import { api } from '../../services/api';
import { toServiceError } from '../../services/error';

export class ReciboMadreSerivices {
  static async getSelectAccion({ tipo_servicio } = {}) {
    try {
      const params = tipo_servicio ? { tipo_servicio } : {};
      const { data } = await api.get('/admin/reportes/recibo/acciones', {
        params,
      });
      const list = Array.isArray(data?.data)
        ? data.data.filter((item) => Number(item.value) !== 0)
        : [];
      return { ...data, data: list };
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async createCobro({ payload }) {
    try {
      const response = await api.post('/admin/cobro/crear-cobro', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
