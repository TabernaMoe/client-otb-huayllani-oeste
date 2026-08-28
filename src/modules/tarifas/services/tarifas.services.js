import {
  api,
} from '../../../services/api';

import {
  toServiceError,
} from '../../../services/error';

/**
 * ============================================================
 * SERVICIOS DE TARIFAS
 * ============================================================
 *
 * Este archivo tiene UNA responsabilidad:
 *
 * comunicarse con el backend.
 *
 * NO contiene Zod.
 * NO contiene useState.
 * NO contiene validaciones visuales.
 */
export class TarifasServices {
  /**
   * ==========================================================
   * OBTENER TODAS LAS TARIFAS
   * ==========================================================
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
        '/admin/tarifa',
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
   * OBTENER TARIFA POR ID
   * ==========================================================
   */
  static async getById(
    id,
  ) {
    try {
      const {
        data,
      } = await api.get(
        `/admin/tarifa/${id}`,
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
   * CREAR TARIFA
   * ==========================================================
   */
  static async create(
    payload,
  ) {
    try {
      const {
        data,
      } = await api.post(
        '/admin/tarifa',
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
   * ACTUALIZAR TARIFA
   * ==========================================================
   */
  static async update(
    id,
    payload,
  ) {
    try {
      const {
        data,
      } = await api.patch(
        `/admin/tarifa/${id}`,
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
   */
  static async changeEstado(
    id,
  ) {
    try {
      const {
        data,
      } = await api.patch(
        `/admin/tarifa/cambiar-estado/${id}`,
      );

      return data;

    } catch (error) {
      return toServiceError(
        error,
      );
    }
  }
}