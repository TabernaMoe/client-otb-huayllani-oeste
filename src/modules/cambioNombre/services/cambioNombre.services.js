import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class CambioNombreServices {
  static async getAcciones(tipoServicio = 'AGUA') {
    try {
      const { data } = await api.get('/admin/reportes/recibo/acciones', {
        params: { tipo_servicio: tipoServicio },
      });
      const list = Array.isArray(data?.data)
        ? data.data.filter((item) => Number(item.value) !== 0)
        : [];
      return { ...data, data: list };
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getSocios() {
    try {
      const { data } = await api.get('/admin/acciones/agua/socios');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload, tipoServicio = 'AGUA') {
    try {
      const endpoint =
        tipoServicio === 'ALCANTARILLADO'
          ? '/admin/acciones/alcantarillado/cambiar-nombre'
          : '/admin/acciones/agua/cambiar-nombre';
      const { data } = await api.post(endpoint, payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
