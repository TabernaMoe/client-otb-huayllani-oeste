import {
  api,
} from '../../../services/api';

import {
  toServiceError,
} from '../../../services/error';


export class MultasServices {

  /**
   * ==========================================================
   * LISTAR MULTAS
   * ==========================================================
   *
   * GET /admin/multa
   *
   * params:
   *
   * {
   *   page,
   *   limit,
   *   search,
   *   estado
   * }
   */
  static async getAll(
    params = {},
  ) {

    try {

      const {
        data,
      } = await api.get(
        '/admin/multa',
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
   * CREAR MULTA
   * ==========================================================
   *
   * POST /admin/multa
   *
   * body:
   *
   * {
   *   nombre_multa,
   *   precio
   * }
   */
  static async create(
    body,
  ) {

    try {

      const {
        data,
      } = await api.post(
        '/admin/multa',
        body,
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
   * EDITAR MULTA
   * ==========================================================
   *
   * PATCH /admin/multa/:id
   */
  static async update(
    id,
    body,
  ) {

    try {

      const {
        data,
      } = await api.patch(
        `/admin/multa/${id}`,
        body,
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
   * PATCH /admin/multa/cambiar-estado/:id
   *
   * Según la documentación,
   * no necesita body.
   */
  static async cambiarEstado(
    id,
  ) {

    try {

      const {
        data,
      } = await api.patch(
        `/admin/multa/cambiar-estado/${id}`,
      );

      return data;

    } catch (error) {

      return toServiceError(
        error,
      );
    }
  }
}