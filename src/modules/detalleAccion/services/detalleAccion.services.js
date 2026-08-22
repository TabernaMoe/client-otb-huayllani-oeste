import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class DetalleAccionServices {
  /**
   * ============================================================
   * OBTENER DETALLES DE ACCIÓN
   * ============================================================
   *
   * GET /admin/accion/detalle
   */
  static async getAll(
    page = 1,
    limit = 10,
    search = '',
    estado = '',
  ) {
    try {
      const params = {
        page: Math.max(
          1,
          Number.parseInt(page, 10) || 1,
        ),

        limit: Math.max(
          1,
          Number.parseInt(limit, 10) || 10,
        ),

        search: String(
          search || '',
        ).trim(),
      };

      /**
       * true  -> activos
       * false -> inactivos
       * ''    -> todos
       */
      if (
        typeof estado === 'boolean'
      ) {
        params.estado = estado;
      }

      const { data } = await api.get(
        '/admin/accion/detalle',
        {
          params,
        },
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * ============================================================
   * TIPOS DE ACCIÓN PARA SELECT
   * ============================================================
   *
   * GET /admin/accion/detalle/tipos-accion
   *
   * data:
   * [
   *   {
   *     value: 1,
   *     label: 'Tipo Accion Uno'
   *   }
   * ]
   */
  static async getTiposAccion() {
    try {
      const { data } = await api.get(
        '/admin/accion/detalle/tipos-accion',
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * ============================================================
   * OBTENER DETALLE POR ID
   * ============================================================
   *
   * GET /admin/accion/detalle/:id
   */
  static async getById(id) {
    try {
      const { data } = await api.get(
        `/admin/accion/detalle/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * ============================================================
   * CREAR DETALLE
   * ============================================================
   *
   * POST /admin/accion/detalle
   */
  static async create(payload) {
    try {
      const cleanPayload = {
        tipo_accion_id: Number(
          payload.tipo_accion_id,
        ),

        nombre_accion: String(
          payload.nombre_accion || '',
        ).trim(),

        precio_accion: Number(
          payload.precio_accion,
        ),

        tipo_cobro: String(
          payload.tipo_cobro || '',
        )
          .trim()
          .toUpperCase(),
      };

      const { data } = await api.post(
        '/admin/accion/detalle',
        cleanPayload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * ============================================================
   * ACTUALIZAR DETALLE
   * ============================================================
   *
   * PATCH /admin/accion/detalle/:id
   */
  static async update(
    id,
    payload,
  ) {
    try {
      const cleanPayload = {
        tipo_accion_id: Number(
          payload.tipo_accion_id,
        ),

        nombre_accion: String(
          payload.nombre_accion || '',
        ).trim(),

        precio_accion: Number(
          payload.precio_accion,
        ),

        tipo_cobro: String(
          payload.tipo_cobro || '',
        )
          .trim()
          .toUpperCase(),
      };

      const { data } = await api.patch(
        `/admin/accion/detalle/${id}`,
        cleanPayload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * ============================================================
   * CAMBIAR ESTADO
   * ============================================================
   *
   * PATCH /admin/accion/detalle/cambiar-estado/:id
   */
  static async changeEstado(id) {
    try {
      const { data } = await api.patch(
        `/admin/accion/detalle/cambiar-estado/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}