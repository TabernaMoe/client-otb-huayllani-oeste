import { z } from 'zod';

export const cobrosAguaParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  search: z
    .string()
    .trim()
    .default(''),

  estado: z
    .string()
    .trim()
    .optional(),
});

export const accionIdSchema = z.coerce
  .number()
  .int()
  .positive('El identificador de la acción no es válido');

export const pagarCobroAguaSchema = z.object({
  monto: z.coerce
    .number()
    .positive('El monto debe ser mayor a cero'),

  cobro_agua_id: z.coerce
    .number()
    .int()
    .positive('Debe seleccionar un cobro de agua válido'),

  metodo_pago: z
    .string()
    .trim()
    .toUpperCase()
    .refine(
      (value) => ['EFECTIVO', 'QR'].includes(value),
      {
        message: 'El método de pago no es válido',
      },
    ),

  observacion: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
});