import { z } from 'zod';

export const calleSchema = z.object({
  nombre_calle: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre debe tener máximo 150 caracteres'),
});
