import { z } from 'zod';

const accionIdSchema = z.coerce.number().int().positive();

const paramsSchema = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1).max(100),
  search: z.string().trim(),
});

const pagoSchema = z.object({
  cobro_agua_id: z.coerce.number().int().positive('Seleccione un cobro'),
  monto: z.coerce.number().positive('El monto debe ser mayor a cero'),
  metodo_pago: z.enum(['EFECTIVO', 'QR', 'TRANSFERENCIA']),
  observacion: z.string().trim().max(250, 'Máximo 250 caracteres').optional(),
});

const errors = (error) =>
  Object.fromEntries(error.issues.map((item) => [item.path[0], item.message]));

export const validateCobrosAguaParams = (data) => paramsSchema.safeParse(data);
export const validateAccionId = (id) => accionIdSchema.safeParse(id);

export const validatePagoAgua = (data) => {
  const result = pagoSchema.safeParse(data);

  return result.success
    ? { ok: true, data: result.data, errors: {} }
    : { ok: false, data: null, errors: errors(result.error) };
};
