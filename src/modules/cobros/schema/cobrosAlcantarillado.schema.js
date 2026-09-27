import { z } from 'zod';

const formatErrors = (error) =>
  Object.fromEntries(
    error.issues.map((issue) => [issue.path[0], issue.message]),
  );

const pagoAlcantarilladoSchema = z.object({
  monto: z.coerce.number().positive('El monto debe ser mayor a 0'),
  cobros: z
    .array(z.coerce.number().int().positive())
    .min(1, 'Debe seleccionar al menos un cobro'),
  metodo_pago: z.enum(['EFECTIVO'], {
    message: 'El método habilitado es EFECTIVO',
  }),
});

export const validatePagoAlcantarillado = (form) => {
  const result = pagoAlcantarilladoSchema.safeParse(form);

  if (!result.success) {
    return {
      isValid: false,
      data: null,
      errors: formatErrors(result.error),
    };
  }

  return {
    isValid: true,
    data: result.data,
    errors: {},
  };
};
