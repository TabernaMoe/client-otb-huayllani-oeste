import { z } from 'zod';

export const cerrarPeriodoSchema = z.object({
  id: z.coerce
    .number({
      required_error: 'Debe seleccionar un periodo',
      invalid_type_error: 'ID inválido',
    })
    .int('El ID debe ser un número entero')
    .positive('El ID debe ser mayor a 0'),
});

export const validateCerrarPeriodo = (data) => {
  const result = cerrarPeriodoSchema.safeParse(data);

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