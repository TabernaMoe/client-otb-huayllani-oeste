import {
  api,
} from '../../../services/api';

import {
  toServiceError,
} from '../../../services/error';

/**
 * ============================================================
 * SERVICIOS DE ACCIONES
 * ============================================================
 *
 * Este archivo solamente se encarga
 * de comunicarse con el backend.
 *
 * NO contiene Zod.
 * NO contiene useState.
 * NO contiene lógica de React.
 */
export class AccionesServices {
  /**
   * ==========================================================
   * OBTENER TODAS LAS ACCIONES
   * ==========================================================
   *
   * params:
   *
   * {
   *   page: 1,
   *   limit: 10,
   *   search: '',
   *   estado: 'ACTIVO'
   * }
   *
   * Axios generará algo parecido a:
   *
   * GET
   * /admin/accion?page=1&limit=10&search=&estado=ACTIVO
   */
  static async getAll(
    params = {},
  ) {
    try {
      const {
        data,
      } = await api.get(
        '/admin/accion',
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
   * OBTENER UNA ACCIÓN
   * ==========================================================
   *
   * GET
   *
   * /admin/accion/3
   *
   * Este endpoint devuelve también:
   *
   * detallesAccion
   */
  static async getById(
    id,
  ) {
    try {
      const {
        data,
      } = await api.get(
        `/admin/accion/${id}`,
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
   * /admin/accion/tipos-accion
   */
  static async getTiposAccion() {
    try {
      const {
        data,
      } = await api.get(
        '/admin/accion/tipos-accion',
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
   * OBTENER DETALLES DE UN TIPO
   * ==========================================================
   *
   * GET
   *
   * /admin/accion/detalle-accion/1
   */
  static async getDetallesAccion(
    tipoAccionId,
  ) {
    try {
      const {
        data,
      } = await api.get(
        `/admin/accion/detalle-accion/${tipoAccionId}`,
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
   * OBTENER SOCIOS
   * ==========================================================
   *
   * GET
   *
   * /admin/accion/socios
   *
   * Respuesta:
   *
   * {
   *   value: 1,
   *   label: '123456 - Nombre'
   * }
   */
  static async getSocios() {
    try {
      const {
        data,
      } = await api.get(
        '/admin/accion/socios',
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
   * OBTENER TARIFAS ACTIVAS
   * ==========================================================
   *
   * GET
   *
   * /admin/accion/tarifa-agua
   */
  static async getTarifas() {
    try {
      const {
        data,
      } = await api.get(
        '/admin/accion/tarifa-agua',
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
   * CREAR ACCIÓN
   * ==========================================================
   *
   * POST
   *
   * /admin/accion
   */
  static async create(
    payload,
  ) {
    try {
      const {
        data,
      } = await api.post(
        '/admin/accion',
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
   * ACTUALIZAR ACCIÓN
   * ==========================================================
   *
   * PATCH
   *
   * /admin/accion/:id
   */
  static async update(
    id,
    payload,
  ) {
    try {
      const {
        data,
      } = await api.patch(
        `/admin/accion/${id}`,
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
   * IMPORTANTE:
   *
   * Tu backend actualmente tiene:
   *
   * camibiar-estado
   *
   * y no:
   *
   * cambiar-estado
   *
   * Lo mantenemos exactamente igual
   * porque así está definido el endpoint.
   */
  static async changeEstado(
    id,
    payload,
  ) {
    try {
      const {
        data,
      } = await api.patch(
        `/admin/accion/camibiar-estado/${id}`,
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