import { z } from 'zod';

/**
 * ============================================================
 * PARÁMETROS DEL LISTADO
 * ============================================================
 *
 * GET /admin/pago-agua
 *
 * {
 *   page: 1,
 *   limit: 10,
 *   search: '',
 *   estado: undefined
 * }
 */
export const cobrosAguaParamsSchema =
  z.object({
    page: z.coerce
      .number()
      .int(
        'La página debe ser un número entero',
      )
      .min(
        1,
        'La página debe ser mayor o igual a 1',
      )
      .default(1),

    limit: z.coerce
      .number()
      .int(
        'El límite debe ser un número entero',
      )
      .min(
        1,
        'El límite debe ser mayor o igual a 1',
      )
      .max(
        100,
        'El límite máximo permitido es 100',
      )
      .default(10),

    search: z
      .string()
      .trim()
      .default(''),

    estado: z
      .string()
      .trim()
      .optional(),
  });

/**
 * ============================================================
 * ID DE ACCIÓN
 * ============================================================
 *
 * Se utiliza para:
 *
 * GET /admin/pago-agua/:accionId
 *
 * GET /admin/pago-agua/historial/:accionId
 *
 * PATCH /admin/pago-agua/pagar/:accionId
 */
export const accionIdSchema = z.coerce
  .number()
  .int(
    'El identificador de la acción debe ser entero',
  )
  .positive(
    'El identificador de la acción no es válido',
  );

/**
 * ============================================================
 * FORMULARIO DE PAGO
 * ============================================================
 *
 * Incluimos:
 *
 * accion_id -> frontend / URL
 * saldo     -> frontend / validación
 *
 * Después los eliminaremos del payload
 * que se envía al backend.
 */
export const pagarCobroAguaFormSchema =
  z
    .object({
      /**
       * ID de la acción.
       *
       * NO va en body.
       */
      accion_id:
        accionIdSchema,

      /**
       * Cobro seleccionado.
       */
      cobro_agua_id: z.coerce
        .number()
        .int(
          'El identificador del cobro debe ser entero',
        )
        .positive(
          'Debe seleccionar un cobro de agua válido',
        ),

      /**
       * Monto.
       */
      monto: z.coerce
        .number({
          invalid_type_error:
            'El monto debe ser numérico',
        })
        .positive(
          'El monto debe ser mayor a cero',
        ),

      /**
       * Método.
       */
      metodo_pago: z
        .string()
        .trim()
        .toUpperCase()
        .refine(
          (value) =>
            [
              'EFECTIVO',
              'QR',
              'TRANSFERENCIA',
            ].includes(
              value,
            ),
          {
            message:
              'El método de pago no es válido',
          },
        ),

      /**
       * Observación.
       */
      observacion: z
        .string()
        .trim()
        .max(
          250,
          'La observación debe tener máximo 250 caracteres',
        )
        .optional()
        .transform(
          (value) =>
            value ||
            undefined,
        ),

      /**
       * Saldo actual.
       *
       * SOLO frontend.
       */
      saldo: z.coerce
        .number()
        .nonnegative()
        .default(0),
    })

    /**
     * ========================================================
     * VALIDACIONES ENTRE CAMPOS
     * ========================================================
     */
    .superRefine(
      (
        data,
        context,
      ) => {
        const monto =
          Number(
            data.monto,
          );

        const saldo =
          Number(
            data.saldo,
          );

        /**
         * En tu interfaz dices:
         *
         * "pago completo"
         *
         * entonces monto debe coincidir
         * exactamente con saldo.
         */
        if (
          saldo > 0 &&
          Math.abs(
            monto -
              saldo,
          ) >
            0.01
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode
                .custom,

            path:
              ['monto'],

            message:
              'El cobro de agua debe pagarse por el saldo completo',
          });
        }
      },
    );

/**
 * ============================================================
 * SCHEMA DEL BODY REAL
 * ============================================================
 *
 * Representa exactamente lo que
 * mandaremos al backend.
 */
export const pagarCobroAguaSchema =
  z.object({
    monto: z.number(),

    cobro_agua_id:
      z.number().int().positive(),

    metodo_pago:
      z.string(),

    observacion:
      z.string().optional(),
  });

/**
 * ============================================================
 * FORMATEAR ERRORES
 * ============================================================
 */
const formatErrors = (
  zodError,
) => {
  const errors = {};

  zodError?.issues?.forEach(
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
 * VALIDADOR GENÉRICO
 * ============================================================
 *
 * Evitamos repetir:
 *
 * safeParse
 * result.success
 * formatErrors
 */
const validateSchema = (
  schema,
  data,
) => {
  const result =
    schema.safeParse(
      data,
    );

  if (
    result.success
  ) {
    return {
      isValid: true,
      errors: {},
      data:
        result.data,
    };
  }

  return {
    isValid: false,

    errors:
      formatErrors(
        result.error,
      ),

    data: null,
  };
};

/**
 * ============================================================
 * VALIDAR PARAMS
 * ============================================================
 */
export const validateCobrosAguaParams = (
  params,
) =>
  validateSchema(
    cobrosAguaParamsSchema,
    params,
  );

/**
 * ============================================================
 * VALIDAR ID
 * ============================================================
 */
export const validateAccionId = (
  id,
) => {
  const result =
    accionIdSchema.safeParse(
      id,
    );

  if (
    result.success
  ) {
    return {
      isValid: true,
      data:
        result.data,
      error: null,
    };
  }

  return {
    isValid: false,
    data: null,

    error:
      result.error
        ?.issues?.[0]
        ?.message ||
      'La acción seleccionada no es válida',
  };
};

/**
 * ============================================================
 * VALIDAR PAGO
 * ============================================================
 *
 * Recibimos:
 *
 * {
 *   accion_id,
 *   cobro_agua_id,
 *   monto,
 *   metodo_pago,
 *   observacion,
 *   saldo
 * }
 *
 * Retornamos:
 *
 * {
 *   accionId,
 *
 *   data: {
 *      cobro_agua_id,
 *      monto,
 *      metodo_pago,
 *      observacion
 *   }
 * }
 */
export const validatePagoAgua = (
  form,
) => {
  const result =
    pagarCobroAguaFormSchema.safeParse(
      form,
    );

  if (
    !result.success
  ) {
    return {
      isValid: false,

      errors:
        formatErrors(
          result.error,
        ),

      accionId:
        null,

      data:
        null,
    };
  }

  /**
   * Separamos los campos
   * exclusivos del frontend.
   */
  const {
    accion_id,
    saldo,
    ...payload
  } = result.data;

  /**
   * Como seguridad adicional,
   * validamos el body final.
   */
  const payloadResult =
    pagarCobroAguaSchema.safeParse(
      payload,
    );

  if (
    !payloadResult.success
  ) {
    return {
      isValid: false,

      errors:
        formatErrors(
          payloadResult.error,
        ),

      accionId:
        null,

      data:
        null,
    };
  }

  return {
    isValid: true,

    errors: {},

    /**
     * Para la URL.
     */
    accionId:
      accion_id,

    /**
     * Para el body.
     */
    data:
      payloadResult.data,
  };
};