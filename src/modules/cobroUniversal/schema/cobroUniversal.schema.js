import { z } from 'zod';

const positiveId = z.coerce.number().int().positive('Selecciona una acción');
const money = z.coerce.number().positive('El monto debe ser mayor a 0');

export const cobroUniversalSchema = z.object({
  accion_id: positiveId,
  concepto: z.string().trim().min(1, 'El concepto es obligatorio').max(150),
  descripcion: z.string().trim().max(500).optional().default(''),
  monto: money,
});
