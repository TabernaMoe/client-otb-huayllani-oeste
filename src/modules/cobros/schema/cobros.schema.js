import { z } from 'zod';

export const pagoCobroSchema = z.object({
  socio_id: z.coerce.number().int().positive('Debe seleccionar un socio'),

  monto: z.coerce
    .number()
    .positive('El monto debe ser mayor a 0')
    .min(1, 'Debe ingresar un monto válido'),

  cobros: z
    .array(z.coerce.number().int().positive())
    .min(1, 'Debe seleccionar al menos un cobro'),

  metodo_pago: z.enum(['EFECTIVO', 'QR', 'TRANSFERENCIA'], {
    message: 'Debe seleccionar un método de pago válido',
  }),

  totalSeleccionado: z.coerce.number().optional(),
});

export const validatePagoCobro = (form) => {
  const result = pagoCobroSchema.safeParse(form);

  if (!result.success) {
    const errors = {};

    result.error.issues.forEach((error) => {
      const field = error.path?.[0];
      if (field) errors[field] = error.message;
    });

    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: {},
    data: result.data,
  };
};