import {
  api,
} from '../../../services/api';

import {
  toServiceError,
} from '../../../services/error';

/**
 * ============================================================
 * SERVICIOS DE TIPOS DE ACCIÓN
 * ============================================================
 *
 * Su única responsabilidad es
 * comunicarse con el backend.
 *
 * Aquí NO usamos:
 *
 * - Zod
 * - useState
 * - validaciones visuales
 */
export class TipoAccionServices {

  static async getAll(
    params = {},
  ) {
    try {
      const {
        data,
      } = await api.get(
        '/admin/accion/tipo-accion',
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
  static async create(
    payload,
  ) {
    try {
      const {
        data,
      } = await api.post(
        '/admin/accion/tipo-accion',
        payload,
      );

      return data;

    } catch (error) {
      return toServiceError(
        error,
      );
    }
  }

  static async update(
    id,
    payload,
  ) {
    try {
      const {
        data,
      } = await api.patch(
        `/admin/accion/tipo-accion/${id}`,
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