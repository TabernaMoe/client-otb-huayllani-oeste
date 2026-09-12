import { z } from 'zod';

export const detalleAccionSchema = z.object({
  tipo_accion_id: z.coerce.number().int().positive('Selecciona un tipo de acción'),
  nombre_accion: z.string().trim().min(3, 'Ingresa al menos 3 caracteres').max(100, 'Máximo 100 caracteres'),
  precio_accion: z.coerce.number().positive('El precio debe ser mayor a 0'),
  tipo_cobro: z.enum(['UNICO', 'MENSUAL'], { message: 'Selecciona un tipo de cobro' }),
});
