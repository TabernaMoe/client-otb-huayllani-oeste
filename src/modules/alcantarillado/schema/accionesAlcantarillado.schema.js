import { z } from 'zod';

const formatErrors = (error) =>
  Object.fromEntries(
    error.issues.map((issue) => [issue.path[0], issue.message]),
  );

export const accionAlcantarilladoSchema = z.object({
  socio_id: z.coerce
    .number()
    .int('Debe seleccionar un socio válido')
    .positive('Debe seleccionar un socio'),

  calle_id: z.coerce
    .number()
    .int('Debe seleccionar una calle válida')
    .positive('Debe seleccionar una calle'),

  direccion: z
    .string()
    .trim()
    .min(1, 'La dirección es obligatoria')
    .max(255, 'La dirección es muy larga'),

  observacion: z
    .string()
    .trim()
    .max(500, 'La observación es muy larga')
    .optional()
    .or(z.literal('')),

  detalles: z
    .array(z.coerce.number().int().positive())
    .min(1, 'Debe seleccionar al menos un detalle de alcantarillado'),
});

export const validateAccionAlcantarillado = (form) => {
  const result = accionAlcantarilladoSchema.safeParse(form);

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
