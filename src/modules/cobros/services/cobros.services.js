import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class CobrosServices {
  /**
   * READ: obtiene la lista de socios habilitados para cobrar.
   *
   * Endpoint:
   * GET /admin/cobro
   *
   * Ejemplo:
   * GET /admin/cobro?search=Jhoan
   */
  static async getSocios(search = '') {
    try {
      const response = await api.get('/admin/cobro', {
        params: {
          // "search" debe llamarse exactamente así
          // porque ese es el nombre esperado por el backend.
          search: String(search || '').trim(),
        },
      });

      // Axios devuelve:
      //
      // response.data = respuesta enviada por el backend.
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * READ: obtiene un socio con sus cobros o deudas.
   *
   * Endpoint:
   * GET /admin/cobro/:socioId
   *
   * Ejemplo:
   * GET /admin/cobro/1
   */
  static async getSocioCobros(socioId) {
    try {
      if (!socioId) {
        return {
          ok: false,
          message: 'Debe seleccionar un socio',
        };
      }

      const response = await api.get(
        `/admin/cobro/${socioId}`,
      );

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * CREATE: registra un pago.
   *
   * Endpoint:
   * POST /admin/cobro
   *
   * El backend espera:
   *
   * {
   *   socio_id: "1",
   *   monto: "100",
   *   cobros: [3],
   *   metodo_pago: "QR"
   * }
   */
  static async pagar(payload) {
    try {
      const cleanPayload = {
        // Las propiedades de este objeto sí deben coincidir
        // exactamente con las esperadas por el backend.
        socio_id: String(payload.socio_id),

        monto: String(payload.monto),

        cobros: payload.cobros.map((Number)),

        metodo_pago: String(payload.metodo_pago)
          .trim()
          .toUpperCase(),
      };

      console.log(
        'PAYLOAD QUE SE ENVIARÁ:',
        cleanPayload,
      );

      const response = await api.post(
        '/admin/cobro',
        cleanPayload,
      );

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}