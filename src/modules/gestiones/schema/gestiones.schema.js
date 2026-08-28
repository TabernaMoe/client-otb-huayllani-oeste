import { z } from 'zod';

/**
 * ============================================================
 * SCHEMA BASE DEL AÑO
 * ============================================================
 *
 * Este schema se reutiliza en:
 *
 * - Crear gestión
 * - Editar gestión
 * - Seleccionar gestión por año
 *
 * z.coerce.number() permite convertir:
 *
 * "2027" -> 2027
 *
 * Esto es muy útil porque los inputs HTML
 * trabajan normalmente con strings.
 */
const anioSchema = z.coerce
  .number({
    invalid_type_error:
      'El año debe ser numérico',
  })
  .int(
    'El año debe ser un número entero',
  )
  .min(
    1900,
    'El año debe ser mayor o igual a 1900',
  )
  .max(
    3000,
    'El año debe ser menor o igual a 3000',
  );

/**
 * ============================================================
 * CREAR GESTIÓN
 * ============================================================
 *
 * Payload esperado:
 *
 * {
 *   anio: 2027
 * }
 */
export const createGestionSchema =
  z.object({
    anio:
      anioSchema,
  });

/**
 * ============================================================
 * EDITAR GESTIÓN
 * ============================================================
 *
 * Lo dejamos preparado aunque actualmente
 * tu service todavía no tiene update().
 */
export const updateGestionSchema =
  z.object({
    anio:
      anioSchema,
  });

/**
 * ============================================================
 * ID DE GESTIÓN
 * ============================================================
 *
 * Se utiliza para validar:
 *
 * GET /admin/gestion/:id
 */
export const gestionIdSchema =
  z.coerce
    .number({
      invalid_type_error:
        'El valor debe ser numérico',
    })
    .int(
      'El valor debe ser un número entero',
    )
    .positive(
      'El valor de la gestión no es válido',
    );

/**
 * ============================================================
 * PAGINACIÓN Y FILTROS
 * ============================================================
 *
 * Ejemplo:
 *
 * {
 *   page: 1,
 *   limit: 10,
 *   search: '',
 *   estado: 'ACTIVO'
 * }
 */
export const gestionParamsSchema =
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
     * Cantidad por página.
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
     * Búsqueda.
     */
    search: z
      .string()
      .trim()
      .default(''),

    /**
     * Estado opcional.
     */
    estado: z
      .enum(
        [
          'ACTIVO',
          'INACTIVO',
        ],
        {
          message:
            'El estado seleccionado no es válido',
        },
      )
      .optional(),
  });

/**
 * ============================================================
 * SELECCIONAR GESTIÓN POR AÑO
 * ============================================================
 */
export const gestionPeriodoSchema =
  z.object({
    anio:
      anioSchema,
  });

/**
 * ============================================================
 * FUNCIÓN INTERNA PARA FORMATEAR ERRORES
 * ============================================================
 *
 * Convierte los errores de Zod:
 *
 * [
 *   {
 *     path: ['anio'],
 *     message: 'El año debe...'
 *   }
 * ]
 *
 * en:
 *
 * {
 *   anio: 'El año debe...'
 * }
 *
 * Esta función NO se importa en el JSX.
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
 * VALIDAR CREACIÓN
 * ============================================================
 *
 * Esta función es la que importaremos
 * desde GestionesPage.jsx.
 *
 * Si todo está correcto:
 *
 * {
 *   isValid: true,
 *   errors: {},
 *   data: {
 *     anio: 2027
 *   }
 * }
 *
 * Si hay error:
 *
 * {
 *   isValid: false,
 *   errors: {
 *     anio: '...'
 *   },
 *   data: null
 * }
 */
export const validateCreateGestion = (
  data,
) => {
  const result =
    createGestionSchema.safeParse(
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
 * VALIDAR ACTUALIZACIÓN
 * ============================================================
 */
export const validateUpdateGestion = (
  data,
) => {
  const result =
    updateGestionSchema.safeParse(
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
 */
export const validateGestionId = (
  id,
) => {
  const result =
    gestionIdSchema.safeParse(
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
 * VALIDAR PARÁMETROS
 * ============================================================
 *
 * Se utilizará antes de:
 *
 * GET /admin/gestion
 */
export const validateGestionParams = (
  data,
) => {
  const normalizedData = {
    ...data,

    /**
     * Si existe estado lo normalizamos.
     */
    estado:
      data?.estado
        ? String(
            data.estado,
          )
            .trim()
            .toUpperCase()
        : undefined,
  };

  const result =
    gestionParamsSchema.safeParse(
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
 * VALIDAR AÑO DE PERIODO
 * ============================================================
 */
export const validateGestionPeriodo = (
  data,
) => {
  const result =
    gestionPeriodoSchema.safeParse(
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