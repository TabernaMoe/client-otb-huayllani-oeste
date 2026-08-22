import { z } from 'zod';

export const cerrarPeriodoSchema = z.object({
  id: z.coerce
    .number({
      required_error: 'El ID del periodo es obligatorio',
      invalid_type_error: 'El ID del periodo no es válido',
    })
    .int('El ID debe ser un número entero')
    .positive('El ID debe ser mayor a 0'),
});