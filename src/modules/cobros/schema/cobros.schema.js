import {
  z,
} from 'zod';


/**
 * ============================================================
 * FORMATEAR ERRORES
 * ============================================================
 *
 * Convierte errores de Zod:
 *
 * [
 *   {
 *     path: ['monto'],
 *     message: 'El monto...'
 *   }
 * ]
 *
 * en:
 *
 * {
 *   monto: 'El monto...'
 * }
 */
const formatErrors = (
  zodError,
) => {

  const errors = {};

  const issues =
    zodError?.issues || [];


  issues.forEach(
    (issue) => {

      const field =
        issue.path?.[0];


      if (
        field &&
        !errors[field]
      ) {

        errors[field] =
          issue.message;
      }
    },
  );


  return errors;
};


/**
 * ============================================================
 * POST - REGISTRAR PAGO
 * ============================================================
 *
 * POST /admin/cobro
 *
 * Backend:
 *
 * {
 *   socio_id: 2,
 *   monto: "100",
 *   cobros: [2],
 *   metodo_pago: "QR"
 * }
 */
export const pagoCobroSchema =
  z.object({

    // ========================================================
    // SOCIO
    // ========================================================

    socio_id:
      z.coerce
        .number({
          message:
            'Debe seleccionar un socio',
        })
        .int(
          'El socio debe tener un ID entero',
        )
        .positive(
          'Debe seleccionar un socio válido',
        ),


    // ========================================================
    // MONTO
    // ========================================================

    monto:
      z.coerce
        .number({
          message:
            'El monto debe ser numérico',
        })
        .positive(
          'El monto debe ser mayor a 0',
        ),


    // ========================================================
    // COBROS
    // ========================================================

    cobros:
      z
        .array(
          z.coerce
            .number()
            .int(
              'El ID del cobro debe ser entero',
            )
            .positive(
              'El cobro seleccionado no es válido',
            ),
        )
        .min(
          1,
          'Debe seleccionar al menos un cobro',
        ),


    // ========================================================
    // MÉTODO DE PAGO
    // ========================================================

    metodo_pago:
      z.enum(
        [
          'QR',
          'EFECTIVO',
        ],
        {
          message:
            'Seleccione un método de pago válido',
        },
      ),
  });


/**
 * ============================================================
 * VALIDAR POST DE PAGO
 * ============================================================
 *
 * Esta función sí se importa al JSX.
 */
export const validatePagoCobro = (
  form,
) => {

  // ----------------------------------------------------------
  // NORMALIZAR
  // ----------------------------------------------------------

  const normalizedData = {

    ...form,

    metodo_pago:
      String(
        form?.metodo_pago || '',
      )
        .trim()
        .toUpperCase(),
  };


  // ----------------------------------------------------------
  // VALIDAR
  // ----------------------------------------------------------

  const result =
    pagoCobroSchema.safeParse(
      normalizedData,
    );


  // ----------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------

  if (
    !result.success
  ) {

    return {

      isValid:
        false,

      errors:
        formatErrors(
          result.error,
        ),

      data:
        null,
    };
  }


  // ----------------------------------------------------------
  // PAYLOAD PARA BACKEND
  // ----------------------------------------------------------

  const payload = {

    socio_id:
      result.data.socio_id,

    /**
     * Zod validó monto como número.
     *
     * Backend documentado recibe:
     *
     * "100"
     *
     * Por eso lo convertimos nuevamente.
     */
    monto:
      String(
        result.data.monto,
      ),

    cobros:
      result.data.cobros,

    metodo_pago:
      result.data.metodo_pago,
  };


  return {

    isValid:
      true,

    errors:
      {},

    data:
      payload,
  };
};


/**
 * ============================================================
 * POST - ASIGNAR MULTA
 * ============================================================
 *
 * POST /admin/cobro/multas/:accionId
 *
 * Body:
 *
 * {
 *   multa_id: 1
 * }
 */
export const asignarMultaSchema =
  z.object({

    accion_id:
      z.coerce
        .number({
          message:
            'La acción no es válida',
        })
        .int(
          'El ID de la acción debe ser entero',
        )
        .positive(
          'Debe seleccionar una acción válida',
        ),


    multa_id:
      z.coerce
        .number({
          message:
            'Debe seleccionar una multa',
        })
        .int(
          'El ID de la multa debe ser entero',
        )
        .positive(
          'Debe seleccionar una multa válida',
        ),
  });


/**
 * ============================================================
 * VALIDAR ASIGNACIÓN DE MULTA
 * ============================================================
 */
export const validateAsignarMulta = (
  data,
) => {

  const result =
    asignarMultaSchema.safeParse(
      data,
    );


  if (
    !result.success
  ) {

    return {

      isValid:
        false,

      errors:
        formatErrors(
          result.error,
        ),

      data:
        null,
    };
  }


  return {

    isValid:
      true,

    errors:
      {},

    data: {

      accion_id:
        result.data.accion_id,

      payload: {

        multa_id:
          result.data.multa_id,
      },
    },
  };
};