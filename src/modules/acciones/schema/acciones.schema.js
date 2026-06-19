import { z } from 'zod';

export const accionSchema = z.object({
  socio_id: z.coerce
    .number()
    .int('Debe seleccionar un socio válido')
    .positive('Debe seleccionar un socio'),

  calle_id: z.coerce
    .number()
    .int('Debe seleccionar una calle válida')
    .positive('Debe seleccionar una calle'),

  tarifa_id: z.coerce
    .number()
    .int('Debe seleccionar una tarifa válida')
    .positive('Debe seleccionar una tarifa'),

  nro_medidor: z
    .string()
    .trim()
    .min(1, 'El número de medidor es obligatorio')
    .max(50, 'El número de medidor es muy largo'),

  direccion: z
    .string()
    .trim()
    .min(1, 'La dirección es obligatoria')
    .max(255, 'La dirección es muy larga'),

  observacion: z.string().trim().optional().or(z.literal('')),

  estado: z.enum(['ACTIVO', 'PASIVO', 'ANULADO'], {
    message: 'Debe seleccionar un estado válido',
  }),

  detallesAccion: z
    .array(z.coerce.number().int().positive())
    .min(1, 'Debe seleccionar al menos un detalle de acción'),
});

export const validateAccionForm = (form) => {
  const result = accionSchema.safeParse({
    ...form,
    estado: String(form.estado || 'ACTIVO').trim().toUpperCase(),
  });

  if (result.success) {
    return {
      isValid: true,
      errors: {},
      data: result.data,
    };
  }

  const errors = {};

  const issues = result.error?.issues || [];

  issues.forEach((error) => {
    const field = error.path?.[0];

    if (field) {
      errors[field] = error.message;
    }
  });

  return {
    isValid: false,
    errors,
  };
};