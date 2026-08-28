import {
  api,
} from '../../../services/api';

import {
  toServiceError,
} from '../../../services/error';

/**
 * ============================================================
 * SERVICES DE COBROS
 * ============================================================
 *
 * Este archivo solamente se comunica
 * con el backend.
 *
 * NO contiene:
 *
 * - Zod
 * - useState
 * - reglas visuales
 */
export class CobrosServices {
  /**
   * ==========================================================
   * OBTENER SOCIOS
   * ==========================================================
   *
   * GET
   *
   * /admin/cobro
   *
   * Según tu documentación este endpoint
   * devuelve los socios con sus acciones.
   *
   * Ejemplo de params:
   *
   * {
   *   page: 1,
   *   limit: 10,
   *   search: ''
   * }
   */
  static async getSocios(
    params = {},
  ) {
    try {
      const {
        data,
      } = await api.get(
        '/admin/cobro',
        {
          params,
        },
      );

      return data;

    } catch (error) {
      return toServiceError(
        error,
      );
    }
  }

  /**
   * ==========================================================
   * OBTENER COBROS DE UN SOCIO
   * ==========================================================
   *
   * GET
   *
   * /admin/cobro/:socioId
   *
   * Ejemplo:
   *
   * /admin/cobro/1
   */
  static async getSocioCobros(
    socioId,
  ) {
    try {
      const {
        data,
      } = await api.get(
        `/admin/cobro/${socioId}`,
      );

      return data;

    } catch (error) {
      return toServiceError(
        error,
      );
    }
  }

  /**
   * ==========================================================
   * REGISTRAR PAGO
   * ==========================================================
   *
   * POST
   *
   * /admin/cobro
   *
   * payload:
   *
   * {
   *   socio_id: 2,
   *   monto: 100,
   *   cobros: [2],
   *   metodo_pago: 'QR'
   * }
   */
  static async pagar(
    payload,
  ) {
    try {
      const {
        data,
      } = await api.post(
        '/admin/cobro',
        payload,
      );

      return data;

    } catch (error) {
      return toServiceError(
        error,
      );
    }
  }
}