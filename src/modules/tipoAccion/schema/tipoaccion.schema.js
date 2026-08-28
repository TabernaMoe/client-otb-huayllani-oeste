import { z } from 'zod';

/**
 * ============================================================
 * EXPRESIÓN REGULAR
 * ============================================================
 *
 * Permitimos:
 *
 * - Letras
 * - Números
 * - Espacios
 * - Tildes
 * - Ñ
 * - #
 * - .
 * - -
 */
const nombreTipoAccionRegex =
  /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.\-]+$/;

/**
 * ============================================================
 * SCHEMA PRINCIPAL
 * ============================================================
 *
 * Se utiliza al CREAR.
 *
 * Payload esperado:
 *
 * {
 *   nombre_tipo_accion: 'Tipo Acción Uno'
 * }
 */
export const tipoAccionSchema =
  z.object({
    nombre_tipo_accion: z
      .string()
      .trim()
      .min(
        3,
        'El tipo de acción debe tener mínimo 3 caracteres',
      )
      .max(
        100,
        'El tipo de acción debe tener máximo 100 caracteres',
      )
      .regex(
        nombreTipoAccionRegex,
        'El nombre del tipo de acción solo puede contener letras, números, espacios y los caracteres # . -',
      ),
  });

/**
 * ============================================================
 * SCHEMA PARA ACTUALIZAR
 * ============================================================
 *
 * .partial() convierte los campos
 * en opcionales.
 *
 * Es útil cuando trabajamos con PATCH.
 *
 * Ejemplo:
 *
 * {
 *   nombre_tipo_accion: 'Nuevo nombre'
 * }
 */
export const updateTipoAccionSchema =
  tipoAccionSchema.partial();

/**
 * ============================================================
 * ID
 * ============================================================
 *
 * Para editar:
 *
 * PATCH /admin/accion/tipo-accion/:id
 */
export const tipoAccionIdSchema =
  z.coerce
    .number({
      invalid_type_error:
        'El identificador debe ser numérico',
    })
    .int(
      'El identificador debe ser un número entero',
    )
    .positive(
      'El identificador del tipo de acción no es válido',
    );

/**
 * ============================================================
 * PAGINACIÓN Y BÚSQUEDA
 * ============================================================
 *
 * Se utiliza para:
 *
 * GET /admin/accion/tipo-accion
 *
 * Ejemplo:
 *
 * {
 *   page: 1,
 *   limit: 5,
 *   search: 'agua'
 * }
 */
export const tipoAccionParamsSchema =
  z.object({
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
     * Texto de búsqueda.
     */
    search: z
      .string()
      .trim()
      .default(''),
  });

/**
 * ============================================================
 * FUNCIÓN INTERNA PARA ERRORES
 * ============================================================
 *
 * Convierte:
 *
 * ZodError
 *
 * en:
 *
 * {
 *   nombre_tipo_accion:
 *     'El tipo de acción debe...'
 * }
 *
 * No necesitamos importarla
 * desde los componentes.
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
 * Esta función será utilizada directamente
 * desde TipoAccionModal.jsx.
 */
export const validateTipoAccion = (
  data,
) => {
  const result =
    tipoAccionSchema.safeParse(
      data,
    );

  /**
   * DATOS CORRECTOS
   */
  if (
    result.success
  ) {
    return {
      isValid: true,

      errors: {},

      /**
       * Estos son los datos
       * que debemos mandar al service.
       */
      data:
        result.data,
    };
  }

  /**
   * DATOS INCORRECTOS
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
 * Se utiliza al editar.
 */
export const validateUpdateTipoAccion = (
  data,
) => {
  const result =
    updateTipoAccionSchema.safeParse(
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
 * VALIDAR PARÁMETROS
 * ============================================================
 *
 * Se utiliza desde TipoAccion.jsx.
 */
export const validateTipoAccionParams = (
  data,
) => {
  const result =
    tipoAccionParamsSchema.safeParse(
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
 * Se utilizará antes del PATCH.
 */
export const validateTipoAccionId = (
  id,
) => {
  const result =
    tipoAccionIdSchema.safeParse(
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