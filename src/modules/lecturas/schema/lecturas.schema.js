import { z } from 'zod';

/**
 * ============================================================
 * LECTURA
 * ============================================================
 */
export const lecturaSchema = z.object({
  lectura_actual: z.coerce
    .number({
      invalid_type_error:
        'La lectura actual debe ser numérica',
    })
    .min(
      0,
      'La lectura no puede ser negativa',
    ),

  observacion: z
    .string()
    .trim()
    .max(
      500,
      'La observación debe tener máximo 500 caracteres',
    )
    .optional()
    .or(z.literal('')),
});

/**
 * ============================================================
 * PARAMS DEL LISTADO
 * ============================================================
 */
export const lecturaParamsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  search: z
    .string()
    .trim()
    .default(''),
});

/**
 * ============================================================
 * ID DE ACCIÓN
 * ============================================================
 */
export const accionLecturaIdSchema =
  z.coerce
    .number()
    .int()
    .positive(
      'El identificador de la acción no es válido',
    );

/**
 * ============================================================
 * ID DE LECTURA
 * ============================================================
 */
export const lecturaIdSchema =
  z.coerce
    .number()
    .int()
    .positive(
      'El identificador de la lectura no es válido',
    );

/**
 * ============================================================
 * FORMATEAR ERRORES
 * ============================================================
 */
const formatErrors = (error) => {
  const errors = {};

  error?.issues?.forEach((issue) => {
    const field =
      issue.path?.[0];

    if (
      field &&
      !errors[field]
    ) {
      errors[field] =
        issue.message;
    }
  });

  return errors;
};

/**
 * ============================================================
 * RESPUESTA GENERAL DE VALIDACIÓN
 * ============================================================
 *
 * Evitamos repetir safeParse + errores
 * en todas las funciones.
 */
const validateSchema = (
  schema,
  data,
) => {
  const result =
    schema.safeParse(data);

  if (result.success) {
    return {
      isValid: true,
      errors: {},
      data: result.data,
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
 * FUNCIONES PARA JSX
 * ============================================================
 */
export const validateLecturaForm = (
  form,
) =>
  validateSchema(
    lecturaSchema,
    form,
  );

export const validateLecturaParams = (
  params,
) =>
  validateSchema(
    lecturaParamsSchema,
    params,
  );

export const validateAccionLecturaId = (
  id,
) =>
  validateSchema(
    accionLecturaIdSchema,
    id,
  );

export const validateLecturaId = (
  id,
) =>
  validateSchema(
    lecturaIdSchema,
    id,
  );