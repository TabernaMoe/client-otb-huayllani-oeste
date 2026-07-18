import { z } from 'zod';

export const pagoAguaSchema = z
  .object({
    accion_id: z.coerce
      .number({
        invalid_type_error: 'La acción seleccionada no es válida',
      })
      .int('La acción seleccionada no es válida')
      .positive('Debe seleccionar una acción'),

    cobro_agua_id: z.coerce
      .number({
        invalid_type_error: 'El cobro seleccionado no es válido',
      })
      .int('El cobro seleccionado no es válido')
      .positive('Debe seleccionar una deuda de agua'),

    monto: z.coerce
      .number({
        invalid_type_error: 'Debe ingresar un monto válido',
      })
      .positive('El monto debe ser mayor a cero'),

    metodo_pago: z.enum(['EFECTIVO', 'QR', 'TRANSFERENCIA'], {
      message: 'Debe seleccionar un método de pago válido',
    }),

    observacion: z
      .string()
      .trim()
      .max(250, 'La observación no puede superar los 250 caracteres')
      .optional()
      .or(z.literal('')),

    saldo: z.coerce.number().nonnegative().optional(),
  })
  .superRefine((data, context) => {
    if (
      Number.isFinite(data.saldo) &&
      data.saldo > 0 &&
      data.monto > data.saldo
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monto'],
        message: 'El monto no puede ser mayor al saldo pendiente',
      });
    }
  });

export const validatePagoAgua = (form) => {
  const result = pagoAguaSchema.safeParse(form);

  if (!result.success) {
    const errors = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path?.[0];

      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    });

    return {
      isValid: false,
      errors,
      data: null,
    };
  }

  const { saldo, ...cleanData } = result.data;

  return {
    isValid: true,
    errors: {},
    data: cleanData,
  };
};