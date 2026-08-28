import {
  api,
} from '../../../services/api';

import {
  toServiceError,
} from '../../../services/error';

/**
 * ============================================================
 * SERVICES DE DETALLE DE ACCIÓN
 * ============================================================
 *
 * Este archivo solamente se encarga
 * de comunicarse con el backend.
 *
 * Aquí NO ponemos:
 *
 * - Zod
 * - useState
 * - validaciones
 * - lógica visual
 */
export class DetalleAccionServices {
  /**
   * ==========================================================
   * OBTENER TODOS
   * ==========================================================
   *
   * GET
   *
   * /admin/accion/detalle
   *
   * params:
   *
   * {
   *   page: 1,
   *   limit: 5,
   *   search: '',
   *   estado: true
   * }
   */
  static async getAll(
    params = {},
  ) {
    try {
      const {
        data,
      } = await api.get(
        '/admin/accion/detalle',
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
   * OBTENER TIPOS DE ACCIÓN
   * ==========================================================
   *
   * GET
   *
   * /admin/accion/detalle/tipos-accion
   */
  static async getTiposAccion() {
    try {
      const {
        data,
      } = await api.get(
        '/admin/accion/detalle/tipos-accion',
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
   * OBTENER DETALLE POR ID
   * ==========================================================
   *
   * GET
   *
   * /admin/accion/detalle/:id
   */
  static async getById(
    id,
  ) {
    try {
      const {
        data,
      } = await api.get(
        `/admin/accion/detalle/${id}`,
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
   * CREAR
   * ==========================================================
   *
   * POST
   *
   * /admin/accion/detalle
   */
  static async create(
    payload,
  ) {
    try {
      const {
        data,
      } = await api.post(
        '/admin/accion/detalle',
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
   * ACTUALIZAR
   * ==========================================================
   *
   * PATCH
   *
   * /admin/accion/detalle/:id
   */
  static async update(
    id,
    payload,
  ) {
    try {
      const {
        data,
      } = await api.patch(
        `/admin/accion/detalle/${id}`,
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
   * /admin/accion/detalle/cambiar-estado/:id
   */
  static async changeEstado(
    id,
  ) {
    try {
      const {
        data,
      } = await api.patch(
        `/admin/accion/detalle/cambiar-estado/${id}`,
      );

      return data;

    } catch (error) {
      return toServiceError(
        error,
      );
    }
  }
}