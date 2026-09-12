import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';
import {
  normalizeBlobError,
  normalizePaymentResponse,
} from '../../../utils/cobrosAgua.utils';

export class CobrosAguaServices {
  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/pago-agua', { params });
      return data;
    } catch (error) {
      throw toServiceError(error);
    }
  }

  static async getByAccionId(accionId) {
    try {
      const { data } = await api.get(`/admin/pago-agua/${accionId}`);
      return data;
    } catch (error) {
      throw toServiceError(error);
    }
  }

  static async getHistorial(accionId) {
    try {
      const { data } = await api.get(`/admin/pago-agua/historial/${accionId}`);
      return data;
    } catch (error) {
      throw toServiceError(error);
    }
  }

  static async pagar(accionId, payload) {
    try {
      const response = await api.patch(
        `/admin/pago-agua/pagar/${accionId}`,
        payload,
        {
          responseType: 'blob',
          headers: { Accept: 'application/pdf, application/json' },
        },
      );

      return normalizePaymentResponse(response);
    } catch (error) {
      throw await normalizeBlobError(error);
    }
  }
}
