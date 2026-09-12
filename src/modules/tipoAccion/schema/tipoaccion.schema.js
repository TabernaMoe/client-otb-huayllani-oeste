import { z } from 'zod';

export const tipoAccionSchema = z.object({
  nombre_tipo_accion: z.string().trim().min(3, 'Ingresa al menos 3 caracteres').max(100, 'Máximo 100 caracteres'),
});
