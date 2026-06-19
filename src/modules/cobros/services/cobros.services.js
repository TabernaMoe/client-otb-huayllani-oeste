import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class CobrosServices {
  static async getSocios(search = '') {
    try {
      const { data } = await api.get('/admin/cobro', {
        params: { search },
      });

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getSocioCobros(socioId) {
    try {
      const { data } = await api.get(`/admin/cobro/${socioId}`);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async pagar(payload) {
    try {
      const cleanPayload = {
        socio_id: String(payload.socio_id),
        monto: String(payload.monto),
        cobros: payload.cobros.map((id) => Number(id)),
        metodo_pago: payload.metodo_pago,
      };

      const { data } = await api.post('/admin/cobro', cleanPayload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}