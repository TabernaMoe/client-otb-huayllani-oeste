import { z } from 'zod';

// =========================
// CERRAR PERIODO
// =========================
export const cerrarPeriodoSchema = z.object({
  id: z.coerce
    .number({
      required_error: 'El ID del periodo es obligatorio',
      invalid_type_error: 'ID inválido',
    })
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0'),
});