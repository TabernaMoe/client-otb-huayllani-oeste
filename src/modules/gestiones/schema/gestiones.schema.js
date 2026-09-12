import { z } from 'zod';

export const gestionSchema = z.object({
  anio: z.coerce
    .number({ message: 'El año es obligatorio' })
    .int('El año debe ser entero')
    .min(2000, 'El año no es válido')
    .max(2100, 'El año no es válido'),
});
