import { z } from 'zod';

const formatErrors = (error) =>
  Object.fromEntries(error.issues.map((issue) => [issue.path[0], issue.message]));

const pagoCobroSchema = z.object({
  monto: z.coerce
    .number()
    .positive('El monto debe ser mayor a 0')
    .max(7500, 'El monto no puede superar Bs 7.500'),
  cobros: z
    .array(z.coerce.number().int().positive())
    .min(1, 'Debe seleccionar al menos un cobro'),
  metodo_pago: z.enum(['QR', 'EFECTIVO'], {
    message: 'Seleccione un método de pago',
  }),
});

export const validatePagoCobro = (form) => {
  const result = pagoCobroSchema.safeParse({
    monto: form.monto,
    cobros: form.cobros,
    metodo_pago: form.metodo_pago,
  });

  if (!result.success) {
    return { isValid: false, errors: formatErrors(result.error), data: null };
  }

  return {
    isValid: true,
    errors: {},
    data: result.data,
  };
};
