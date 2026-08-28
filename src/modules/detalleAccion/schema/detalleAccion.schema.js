import { z } from 'zod';

/**
 * ============================================================
 * SCHEMA PRINCIPAL DEL DETALLE DE ACCIÓN
 * ============================================================
 *
 * Este schema valida los datos necesarios
 * para crear un detalle de acción.
 *
 * Payload esperado:
 *
 * {
 *   tipo_accion_id: 1,
 *   nombre_accion: 'Carnet socio',
 *   precio_accion: 100,
 *   tipo_cobro: 'UNICO'
 * }
 */
export const detalleAccionSchema = z.object({
  /**
   * ==========================================================
   * TIPO DE ACCIÓN
   * ==========================================================
   *
   * El <select> devuelve strings:
   *
   * "1"
   *
   * z.coerce.number() lo transforma:
   *
   * "1" -> 1
   */
  tipo_accion_id: z.coerce
    .number({
      invalid_type_error:
        'Debe seleccionar un tipo de acción válido',
    })
    .int(
      'Debe seleccionar un tipo de acción válido',
    )
    .positive(
      'Debe seleccionar un tipo de acción',
    ),

  /**
   * ==========================================================
   * NOMBRE DEL DETALLE
   * ==========================================================
   */
  nombre_accion: z
    .string()
    .trim()
    .min(
      3,
      'El nombre debe tener mínimo 3 caracteres',
    )
    .max(
      100,
      'El nombre debe tener máximo 100 caracteres',
    )
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.\-]+$/,
      'El nombre solo puede contener letras, números, espacios y los caracteres # . -',
    ),

  /**
   * ==========================================================
   * PRECIO
   * ==========================================================
   *
   * El input puede entregar:
   *
   * "100"
   *
   * Zod lo convierte:
   *
   * 100
   */
  precio_accion: z.coerce
    .number({
      invalid_type_error:
        'El precio debe ser numérico',
    })
    .positive(
      'El precio debe ser mayor a 0',
    ),

  /**
   * ==========================================================
   * TIPO DE COBRO
   * ==========================================================
   *
   * Actualmente tu formulario maneja:
   *
   * UNICO
   * MENSUAL
   */
  tipo_cobro: z.enum(
    [
      'UNICO',
      'MENSUAL',
    ],
    {
      message:
        'Debe seleccionar un tipo de cobro válido',
    },
  ),
});

/**
 * ============================================================
 * SCHEMA PARA EDITAR
 * ============================================================
 *
 * Como PATCH permite enviar solamente
 * los campos modificados usamos partial().
 */
export const updateDetalleAccionSchema =
  detalleAccionSchema.partial();

/**
 * ============================================================
 * ID
 * ============================================================
 *
 * Se utiliza para:
 *
 * GET /detalle/:id
 * PATCH /detalle/:id
 * cambiar estado
 */
export const detalleAccionIdSchema = z.coerce
  .number({
    invalid_type_error:
      'El identificador debe ser numérico',
  })
  .int(
    'El identificador debe ser un número entero',
  )
  .positive(
    'El identificador del detalle no es válido',
  );

/**
 * ============================================================
 * PARÁMETROS DE LISTADO
 * ============================================================
 *
 * GET /admin/accion/detalle
 */
export const detalleAccionParamsSchema =
  z.object({
    /**
     * Página.
     */
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

    /**
     * Registros por página.
     */
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
      .default(5),

    /**
     * Búsqueda.
     */
    search: z
      .string()
      .trim()
      .default(''),

    /**
     * Estado.
     *
     * true      -> activos
     * false     -> inactivos
     * undefined -> todos
     */
    estado: z
      .boolean()
      .optional(),

    /**
     * Lo dejamos preparado
     * por si después filtras también
     * por tipo de acción.
     */
    tipo_accion_id: z.coerce
      .number()
      .int()
      .positive()
      .optional(),
  });

/**
 * ============================================================
 * FUNCIÓN INTERNA PARA FORMATEAR ERRORES
 * ============================================================
 *
 * Convierte:
 *
 * ZodError
 *
 * en:
 *
 * {
 *   nombre_accion: '...',
 *   precio_accion: '...'
 * }
 *
 * Esta función NO se importa en los JSX.
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
       * Guardamos solamente
       * el primer error de cada campo.
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
 * VALIDAR CREACIÓN
 * ============================================================
 *
 * Esta función se importa
 * directamente en el modal.
 */
export const validateDetalleAccion = (
  data,
) => {
  /**
   * Normalizamos tipo_cobro.
   *
   * "unico"
   *
   * pasa a:
   *
   * "UNICO"
   */
  const normalizedData = {
    ...data,

    tipo_cobro: String(
      data?.tipo_cobro || '',
    )
      .trim()
      .toUpperCase(),
  };

  const result =
    detalleAccionSchema.safeParse(
      normalizedData,
    );

  /**
   * DATOS CORRECTOS.
   */
  if (
    result.success
  ) {
    return {
      isValid: true,

      errors: {},

      /**
       * Estos datos ya están
       * transformados por Zod.
       */
      data:
        result.data,
    };
  }

  /**
   * DATOS INCORRECTOS.
   */
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
 * VALIDAR ACTUALIZACIÓN
 * ============================================================
 *
 * Se utiliza cuando editamos.
 */
export const validateUpdateDetalleAccion = (
  data,
) => {
  const normalizedData = {
    ...data,

    /**
     * Solamente normalizamos si existe.
     *
     * Esto es importante porque el schema
     * de actualización es partial().
     */
    tipo_cobro:
      data?.tipo_cobro
        ? String(
            data.tipo_cobro,
          )
            .trim()
            .toUpperCase()
        : undefined,
  };

  const result =
    updateDetalleAccionSchema.safeParse(
      normalizedData,
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
 * VALIDAR ID
 * ============================================================
 */
export const validateDetalleAccionId = (
  id,
) => {
  const result =
    detalleAccionIdSchema.safeParse(
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
      'Identificador inválido',
  };
};

/**
 * ============================================================
 * VALIDAR PARAMS DEL LISTADO
 * ============================================================
 */
export const validateDetalleAccionParams = (
  data,
) => {
  const result =
    detalleAccionParamsSchema.safeParse(
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