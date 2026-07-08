import { z } from 'zod';

export const lecturaSchema = z.object({
  lectura_actual: z.coerce
    .number({
      invalid_type_error: 'La lectura actual es obligatoria',
    })
    .min(0, 'La lectura no puede ser negativa'),

  observacion: z.string().trim().optional().or(z.literal('')),
});

export const validateLecturaForm = (form) => {
  const result = lecturaSchema.safeParse(form);

  if (result.success) {
    return {
      isValid: true,
      errors: {},
      data: result.data,
    };
  }

  const errors = {};

  result.error.errors.forEach((error) => {
    errors[error.path[0]] = error.message;
  });

  return {
    isValid: false,
    errors,
  };
};