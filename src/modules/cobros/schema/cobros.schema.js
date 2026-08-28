import { z } from 'zod';

/**
 * ============================================================
 * ID DEL SOCIO
 * ============================================================
 *
 * Podemos reutilizar este schema para:
 *
 * - seleccionar un socio
 * - GET /admin/cobro/:socioId
 *
 * z.coerce permite transformar:
 *
 * "1" -> 1
 */
export const socioCobroIdSchema = z.coerce
  .number({
    invalid_type_error:
      'El identificador del socio debe ser numérico',
  })
  .int(
    'El identificador del socio debe ser un número entero',
  )
  .positive(
    'Debe seleccionar un socio válido',
  );

/**
 * ============================================================
 * PARÁMETROS PARA LISTAR SOCIOS
 * ============================================================
 *
 * GET /admin/cobro
 *
 * Según tu endpoint puede utilizar:
 *
 * {
 *   page: 1,
 *   limit: 10,
 *   search: ''
 * }
 */
export const cobrosParamsSchema = z.object({
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
});

/**
 * ============================================================
 * SCHEMA DEL PAGO
 * ============================================================
 *
 * Datos utilizados por el formulario:
 *
 * {
 *   socio_id: "2",
 *   monto: "100",
 *   cobros: [2],
 *   metodo_pago: "QR",
 *   totalSeleccionado: 100
 * }
 *
 * IMPORTANTE:
 *
 * totalSeleccionado solamente se utiliza
 * para validar en frontend.
 *
 * NO debemos enviarlo al backend.
 */
export const pagoCobroSchema = z
  .object({
    /**
     * ==========================================================
     * SOCIO
     * ==========================================================
     */
    socio_id:
      socioCobroIdSchema,

    /**
     * ==========================================================
     * MONTO
     * ==========================================================
     *
     * "100"
     *
     * se transforma a:
     *
     * 100
     */
    monto: z.coerce
      .number({
        invalid_type_error:
          'El monto debe ser numérico',
      })
      .positive(
        'El monto debe ser mayor a 0',
      )
      .min(
        100,
        'El monto mínimo es de Bs 100',
      ),

    /**
     * ==========================================================
     * COBROS SELECCIONADOS
     * ==========================================================
     *
     * Ejemplo:
     *
     * [2]
     *
     * o:
     *
     * [2, 3, 5]
     */
    cobros: z
      .array(
        z.coerce
          .number()
          .int(
            'El identificador del cobro debe ser entero',
          )
          .positive(
            'El identificador del cobro no es válido',
          ),
      )
      .min(
        1,
        'Debe seleccionar al menos un cobro',
      ),

    /**
     * ==========================================================
     * MÉTODO DE PAGO
     * ==========================================================
     */
    metodo_pago: z.enum(
      [
        'EFECTIVO',
        'QR',
      ],
      {
        message:
          'Debe seleccionar un método de pago válido',
      },
    ),

    /**
     * ==========================================================
     * TOTAL SELECCIONADO
     * ==========================================================
     *
     * Este dato NO pertenece al backend.
     *
     * Solamente sirve para comparar:
     *
     * monto vs saldo seleccionado.
     */
    totalSeleccionado: z.coerce
      .number()
      .nonnegative(
        'El total seleccionado no puede ser negativo',
      )
      .optional(),
  })

  /**
   * ============================================================
   * VALIDACIONES ENTRE CAMPOS
   * ============================================================
   */
  .superRefine(
    (
      data,
      context,
    ) => {
      const total =
        Number(
          data.totalSeleccionado ||
            0,
        );

      const monto =
        Number(
          data.monto ||
            0,
        );

      /**
       * ========================================================
       * NO PAGAR MÁS DE LO SELECCIONADO
       * ========================================================
       */
      if (
        total > 0 &&
        monto > total
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,

          path:
            [
              'monto',
            ],

          message:
            'El monto no puede superar el saldo seleccionado',
        });
      }

      /**
       * ========================================================
       * VARIOS COBROS
       * ========================================================
       *
       * Si seleccionamos varias deudas:
       *
       * [
       *   deuda 1,
       *   deuda 2
       * ]
       *
       * debemos pagar todo el monto seleccionado.
       */
      if (
        data.cobros.length >
        1
      ) {
        const diferencia =
          Math.abs(
            monto -
              total,
          );

        /**
         * Usamos 0.01 para evitar
         * problemas de decimales.
         */
        if (
          diferencia >
          0.01
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,

            path:
              [
                'monto',
              ],

            message:
              'Al seleccionar varios cobros debe pagar el monto completo',
          });
        }
      }
    },
  );

/**
 * ============================================================
 * FUNCIÓN INTERNA DE ERRORES
 * ============================================================
 *
 * Convierte:
 *
 * ZodError
 *
 * en:
 *
 * {
 *   monto: '...',
 *   cobros: '...'
 * }
 *
 * Esta función NO se importa en React.
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

      /**
       * Conservamos solamente
       * el primer error del campo.
       */
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
 * VALIDAR PAGO
 * ============================================================
 *
 * ESTA es la función que importaremos
 * desde CobrosPage.jsx.
 */
export const validatePagoCobro = (
  form,
) => {
  /**
   * Normalizamos el método.
   *
   * qr
   *
   * ->
   *
   * QR
   */
  const normalizedData = {
    ...form,

    metodo_pago:
      String(
        form?.metodo_pago ||
          '',
      )
        .trim()
        .toUpperCase(),
  };

  const result =
    pagoCobroSchema.safeParse(
      normalizedData,
    );

  /**
   * ==========================================================
   * ERROR
   * ==========================================================
   */
  if (
    !result.success
  ) {
    return {
      isValid: false,

      errors:
        formatErrors(
          result.error,
        ),

      data: null,
    };
  }

  /**
   * ==========================================================
   * CORRECTO
   * ==========================================================
   *
   * MUY IMPORTANTE:
   *
   * totalSeleccionado solamente
   * sirve para frontend.
   *
   * Por eso lo sacamos antes
   * de retornar data.
   */
  const {
    totalSeleccionado,
    ...payload
  } = result.data;

  return {
    isValid: true,

    errors: {},

    /**
     * Esto será exactamente
     * lo enviado al backend:
     *
     * {
     *   socio_id,
     *   monto,
     *   cobros,
     *   metodo_pago
     * }
     */
    data:
      payload,
  };
};

/**
 * ============================================================
 * VALIDAR ID DEL SOCIO
 * ============================================================
 *
 * Antes de:
 *
 * GET /admin/cobro/:socioId
 */
export const validateSocioCobroId = (
  id,
) => {
  const result =
    socioCobroIdSchema.safeParse(
      id,
    );

  if (
    result.success
  ) {
    return {
      isValid: true,

      data:
        result.data,

      error:
        null,
    };
  }

  return {
    isValid: false,

    data: null,

    error:
      result.error
        ?.issues?.[0]
        ?.message ||
      'Socio inválido',
  };
};

/**
 * ============================================================
 * VALIDAR PARAMS DEL LISTADO
 * ============================================================
 */
export const validateCobrosParams = (
  params,
) => {
  const result =
    cobrosParamsSchema.safeParse(
      params,
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