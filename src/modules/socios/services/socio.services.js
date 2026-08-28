import {
  api,
} from '../../../services/api';

import {
  toServiceError,
} from '../../../services/error';


/**
 * ============================================================
 * SERVICIOS DE SOCIO
 * ============================================================
 *
 * Este archivo se encarga únicamente
 * de comunicarse con el backend.
 */
export class SocioServices {

  /**
   * ==========================================================
   * LISTAR SOCIOS
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
        '/admin/socio',
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
   * OBTENER SOCIO POR ID
   * ==========================================================
   */
  static async getById(
    id,
  ) {

    try {

      const {
        data,
      } = await api.get(
        `/admin/socio/${id}`,
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
   * CREAR SOCIO
   * ==========================================================
   */
  static async create(
    payload,
  ) {

    try {

      const {
        data,
      } = await api.post(
        '/admin/socio',
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
   * ACTUALIZAR SOCIO
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
        `/admin/socio/${id}`,
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
        `/admin/socio/cambiar-estado/${id}`,
      );

      return data;

    } catch (error) {

      return toServiceError(
        error,
      );
    }
  }
}