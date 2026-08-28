import {
  api,
} from '../../../services/api';

import {
  toServiceError,
} from '../../../services/error';

/**
 * ============================================================
 * SERVICIOS DE CALLES
 * ============================================================
 *
 * Este archivo solamente se comunica
 * con el backend.
 *
 * NO contiene Zod.
 * NO contiene estados React.
 * NO contiene validaciones del formulario.
 */
export class CallesServices {
  /**
   * ==========================================================
   * OBTENER TODAS LAS CALLES
   * ==========================================================
   *
   * params ejemplo:
   *
   * {
   *   page: 1,
   *   limit: 5,
   *   search: '',
   *   estado: true
   * }
   *
   * Axios generará:
   *
   * /admin/calle
   * ?page=1
   * &limit=5
   * &search=
   * &estado=true
   */
  static async getAll(
    params = {},
  ) {
    try {
      const {
        data,
      } = await api.get(
        '/admin/calle',
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
   * OBTENER CALLE POR ID
   * ==========================================================
   *
   * GET
   *
   * /admin/calle/1
   */
  static async getById(
    id,
  ) {
    try {
      const {
        data,
      } = await api.get(
        `/admin/calle/${id}`,
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
   * CREAR CALLE
   * ==========================================================
   *
   * POST
   *
   * /admin/calle
   *
   * payload:
   *
   * {
   *   nombre_calle: 'Calle nueva'
   * }
   */
  static async create(
    payload,
  ) {
    try {
      /**
       * Ya NO necesitamos limpiar aquí:
       *
       * String(...).trim()
       *
       * porque Zod ya entregará
       * validation.data limpio.
       */
      const {
        data,
      } = await api.post(
        '/admin/calle',
        payload,
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
   * ACTUALIZAR CALLE
   * ==========================================================
   *
   * PATCH
   *
   * /admin/calle/:id
   */
  static async update(
    id,
    payload,
  ) {
    try {
      const {
        data,
      } = await api.patch(
        `/admin/calle/${id}`,
        payload,
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
   * CAMBIAR ESTADO
   * ==========================================================
   *
   * PATCH
   *
   * /admin/calle/cambiar-estado/:id
   */
  static async toggleStatus(
    id,
  ) {
    try {
      const {
        data,
      } = await api.patch(
        `/admin/calle/cambiar-estado/${id}`,
      );

      return data;

    } catch (error) {
      return toServiceError(
        error,
      );
    }
  }
}