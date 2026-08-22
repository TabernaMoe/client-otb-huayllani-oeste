import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class TarifasServices {
  /**
   * ============================================================
   * OBTENER TARIFAS
   * ============================================================
   *
   * GET /admin/tarifa
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

        search: String(search || '').trim(),
      };

      /**
       * true  -> activas
       * false -> inactivas
       * ''    -> todas
       */
      if (typeof estado === 'boolean') {
        params.estado = estado;
      }

      const { data } = await api.get(
        '/admin/tarifa',
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
   * OBTENER TARIFA POR ID
   * ============================================================
   *
   * GET /admin/tarifa/:id
   */
  static async getById(id) {
    try {
      const { data } = await api.get(
        `/admin/tarifa/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * ============================================================
   * CREAR TARIFA
   * ============================================================
   *
   * POST /admin/tarifa
   *
   * {
   *   nombre_tarifa: "Empresaria",
   *   rangosTarifa: [
   *     {
   *       consumo_minimo: 0,
   *       consumo_maximo: 10,
   *       precio: 10
   *     },
   *     {
   *       consumo_minimo: 31,
   *       consumo_maximo: null,
   *       precio: 40
   *     }
   *   ]
   * }
   */
  static async create(payload) {
  try {
    const cleanPayload = {
      nombre_tarifa: String(
        payload.nombre_tarifa || '',
      ).trim(),

      rangosTarifa: (
        payload.rangosTarifa || []
      ).map((rango) => ({
        consumo_minimo: Number(
          rango.consumo_minimo,
        ),

        consumo_maximo:
          rango.consumo_maximo === null ||
          rango.consumo_maximo === ''
            ? null
            : Number(
                rango.consumo_maximo,
              ),

        precio: Number(
          rango.precio,
        ),
      })),
    };

    console.log(
      'PAYLOAD TARIFA:',
      JSON.stringify(cleanPayload, null, 2),
    );

    const { data } = await api.post(
      '/admin/tarifa',
      cleanPayload,
    );

    return data;
  } catch (error) {
    console.error(
      'ERROR BACKEND TARIFA:',
      error?.response?.data,
    );

    console.error(
      'ERRORES VALIDACIÓN:',
      error?.response?.data?.errors,
    );

    return toServiceError(error);
  }
}

  /**
   * ============================================================
   * ACTUALIZAR TARIFA
   * ============================================================
   *
   * PATCH /admin/tarifa/:id
   */
  static async update(id, payload) {
    try {
      const cleanPayload = {
        nombre_tarifa: String(
          payload.nombre_tarifa || '',
        ).trim(),

        rangosTarifa: (
          payload.rangosTarifa || []
        ).map((rango) => ({
          consumo_minimo: Number(
            rango.consumo_minimo,
          ),

          consumo_maximo:
            rango.consumo_maximo === null ||
            rango.consumo_maximo === ''
              ? null
              : Number(
                  rango.consumo_maximo,
                ),

          precio: Number(
            rango.precio,
          ),
        })),
      };

      const { data } = await api.patch(
        `/admin/tarifa/${id}`,
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
   * PATCH /admin/tarifa/cambiar-estado/:id
   */
  static async changeEstado(id) {
    try {
      const { data } = await api.patch(
        `/admin/tarifa/cambiar-estado/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}