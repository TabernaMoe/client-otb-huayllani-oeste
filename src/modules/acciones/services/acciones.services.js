import {
  api,
} from '../../../services/api';

import {
  toServiceError,
} from '../../../services/error';


export class AccionesServices {
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
   * OBTENER ACCIÓN POR ID
   * ==========================================================
   *
   * GET /admin/accion/:id
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
   * TIPOS DE ACCIÓN
   * ==========================================================
   *
   * GET /admin/accion/tipos-accion
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
   * DETALLES SEGÚN TIPO
   * ==========================================================
   *
   * GET /admin/accion/detalle-accion/:tipoAccionId
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
   * SOCIOS PARA SELECT
   * ==========================================================
   *
   * GET /admin/accion/socios
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
   * TARIFAS ACTIVAS
   * ==========================================================
   *
   * GET /admin/accion/tarifa-agua
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
   * POST /admin/accion
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
   * PATCH /admin/accion/:id
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
   * El backend tiene actualmente:
   *
   * camibiar-estado
   *
   * Lo respetamos exactamente.
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


  /**
   * ==========================================================
   * CAMBIAR PROPIETARIO / NOMBRE
   * ==========================================================
   *
   * PATCH /admin/accion/cambiar-nombre/:id
   *
   * payload:
   *
   * {
   *   nuevoSocioId: 1,
   *   tipo: 'FAMILIAR'
   * }
   */
  static async changeNombre(
    id,
    payload,
  ) {
    try {

      const {
        data,
      } = await api.patch(
        `/admin/accion/cambiar-nombre/${id}`,
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