import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class CobrosServices {
  static async getSocios(params = {}) {
    try {
      const { data } = await api.get('/admin/socio', { params });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getAccionesByServicio(tipo_servicio = 'AGUA') {
    try {
      const { data } = await api.get('/admin/reportes/recibo/acciones', {
        params: { tipo_servicio },
      });
      const list = Array.isArray(data?.data)
        ? data.data.filter((item) => Number(item.value) !== 0)
        : [];
      return { ...data, data: list };
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getCobrosBySocio(socioId, tipo_cobro = 'TODOS') {
    try {
      const { data } = await api.get(
        `/admin/cobros-generales/cobros/socios/${socioId}`,
        { params: { tipo_cobro } },
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getCobrosByAccion(accionId, tipo_cobro = 'TODOS') {
    try {
      const { data } = await api.get(
        `/admin/cobros-generales/cobros/accion/${accionId}`,
        { params: { tipo_cobro } },
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async pagar(payload) {
    try {
      const { data } = await api.post(
        '/admin/cobros-generales/cobros/pagar',
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
