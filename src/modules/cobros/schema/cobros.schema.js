import { z } from 'zod';

export const pagoCobroSchema = z
  .object({
    socio_id: z.coerce
      .number()
      .int()
      .positive('Debe seleccionar un socio'),

    monto: z.coerce
      .number()
      .positive('El monto debe ser mayor a 0')
      .min(100, 'El monto mínimo es de Bs 100'),

    cobros: z
      .array(z.coerce.number().int().positive())
      .min(1, 'Debe seleccionar al menos un cobro'),

    metodo_pago: z.enum(
      ['EFECTIVO', 'QR'],
      {
        message:
          'Debe seleccionar un método de pago válido',
      },
    ),

    // Este valor solo se utiliza en el frontend para validar.
    // No tiene que enviarse al backend.
    totalSeleccionado: z.coerce
      .number()
      .nonnegative()
      .optional(),
  })
  .superRefine((data, context) => {
    const total = Number(data.totalSeleccionado || 0);
    const monto = Number(data.monto || 0);

    // No permitir pagar más que el saldo seleccionado.
    if (total > 0 && monto > total) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monto'],
        message:
          'El monto no puede superar el saldo seleccionado',
      });
    }

    // Cuando se seleccionan varias deudas,
    // se debe pagar el total completo.
    if (data.cobros.length > 1) {
      const diferencia = Math.abs(monto - total);

      if (diferencia > 0.01) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['monto'],
          message:
            'Al seleccionar varios cobros debe pagar el monto completo',
        });
      }
    }
  });

export const validatePagoCobro = (form) => {
  const result = pagoCobroSchema.safeParse(form);

  if (!result.success) {
    const errors = {};

    result.error.issues.forEach((error) => {
      const field = error.path?.[0];

      // Conservamos el primer error de cada campo.
      if (field && !errors[field]) {
        errors[field] = error.message;
      }
    });

    return {
      isValid: false,
      errors,
      data: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    data: result.data,
  };
};