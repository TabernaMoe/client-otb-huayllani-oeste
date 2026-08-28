import { z } from 'zod';

/**
 * ============================================================
 * SCHEMA PRINCIPAL DE CALLE
 * ============================================================
 *
 * Este schema representa los datos necesarios
 * para crear o actualizar una calle.
 *
 * Payload esperado:
 *
 * {
 *   nombre_calle: 'Bolívar'
 * }
 */
export const calleSchema = z.object({
  /**
   * ==========================================================
   * NOMBRE DE LA CALLE
   * ==========================================================
   *
   * trim():
   * elimina espacios antes y después.
   *
   * min():
   * obliga a escribir un nombre.
   *
   * max():
   * evita nombres excesivamente largos.
   */
  nombre_calle: z
    .string()
    .trim()
    .min(
      1,
      'El nombre de la calle es obligatorio',
    )
    .min(
      2,
      'El nombre de la calle debe tener mínimo 2 caracteres',
    )
    .max(
      150,
      'El nombre de la calle debe tener máximo 150 caracteres',
    ),
});

/**
 * ============================================================
 * SCHEMA PARA ACTUALIZAR
 * ============================================================
 *
 * Actualmente el PATCH solamente modifica:
 *
 * {
 *   nombre_calle
 * }
 *
 * Como ese campo sigue siendo requerido en tu endpoint,
 * reutilizamos el mismo schema.
 */
export const updateCalleSchema =
  calleSchema;

/**
 * ============================================================
 * ID DE CALLE
 * ============================================================
 *
 * Se utiliza antes de:
 *
 * GET /admin/calle/:id
 *
 * PATCH /admin/calle/:id
 *
 * PATCH /admin/calle/cambiar-estado/:id
 *
 *
 * z.coerce permite:
 *
 * '10' -> 10
 */
export const calleIdSchema = z.coerce
  .number({
    invalid_type_error:
      'El identificador debe ser numérico',
  })
  .int(
    'El identificador debe ser un número entero',
  )
  .positive(
    'El identificador de la calle no es válido',
  );

/**
 * ============================================================
 * PARÁMETROS DEL LISTADO
 * ============================================================
 *
 * Se utilizará para:
 *
 * GET /admin/calle
 *
 * Ejemplo:
 *
 * {
 *   page: 1,
 *   limit: 5,
 *   search: 'bolivar',
 *   estado: true
 * }
 */
export const calleParamsSchema = z.object({
  /**
   * Página actual.
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
   * Cantidad de registros.
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
    .default(10),

  /**
   * Texto de búsqueda.
   */
  search: z
    .string()
    .trim()
    .default(''),

  /**
   * Estado.
   *
   * true      -> activas
   * false     -> inactivas
   * undefined -> todas
   */
  estado: z
    .boolean()
    .optional(),
});

/**
 * ============================================================
 * FUNCIÓN INTERNA PARA ERRORES
 * ============================================================
 *
 * Esta función NO se importa desde React.
 *
 * Convierte un ZodError como:
 *
 * [
 *   {
 *     path: ['nombre_calle'],
 *     message: 'El nombre...'
 *   }
 * ]
 *
 * en:
 *
 * {
 *   nombre_calle: 'El nombre...'
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

      /**
       * Guardamos solamente
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
 * VALIDAR CREACIÓN
 * ============================================================
 *
 * Esta función se importa directamente
 * en CalleModal.jsx.
 *
 *
 * CORRECTO:
 *
 * {
 *   isValid: true,
 *   errors: {},
 *   data: {
 *      nombre_calle: 'Bolívar'
 *   }
 * }
 *
 *
 * INCORRECTO:
 *
 * {
 *   isValid: false,
 *   errors: {
 *      nombre_calle: '...'
 *   },
 *   data: null
 * }
 */
export const validateCalle = (
  data,
) => {
  const result =
    calleSchema.safeParse(
      data,
    );

  if (
    result.success
  ) {
    return {
      isValid: true,

      errors: {},

      /**
       * Este es el objeto que
       * enviaremos al backend.
       */
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
 * VALIDAR ACTUALIZACIÓN
 * ============================================================
 */
export const validateUpdateCalle = (
  data,
) => {
  const result =
    updateCalleSchema.safeParse(
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
 * VALIDAR PARÁMETROS DEL LISTADO
 * ============================================================
 *
 * Esta función se utilizará desde CallesPage.jsx.
 */
export const validateCalleParams = (
  data,
) => {
  const result =
    calleParamsSchema.safeParse(
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
 * VALIDAR ID
 * ============================================================
 *
 * Se utiliza antes de:
 *
 * - obtener por ID
 * - actualizar
 * - cambiar estado
 */
export const validateCalleId = (
  id,
) => {
  const result =
    calleIdSchema.safeParse(
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