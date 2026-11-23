import { api } from '../../../../services/api';
import { toServiceError } from '../../../../services/error';

export class ReciboServices {
  static async getAll() {
    try {
      const { data } = await api.get('/admin/cobros-generales/recibos');
      return data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async getAccionesByServicio({ tipo_servicio, search = '' } = {}) {
    try {
      const params = {
        ...(tipo_servicio ? { tipo_servicio } : {}),
        ...(search ? { search } : {}),
      };
      const { data } = await api.get('/admin/reportes/recibo/acciones', {
        params,
      });
      return data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async getRecibosByAccion({ id }) {
    try {
      const { data } = await api.get(
        `/admin/cobros-generales/recibos/accion/${id}`,
      );
      return data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
