import { z } from 'zod';

const fechaIso = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Selecciona una fecha válida');

export const filtroFechasCobroSchema = z
  .object({
    fecha_inicio: fechaIso,
    fecha_final: fechaIso,
    estado: z.enum(['PENDIENTE', 'PAGADO', 'PARCIAL', 'ANULADO', 'TODOS']),
    tipo_cobro: z.enum([
      'ACCION_AGUA',
      'ACCION_ALCANTARILLADO',
      'CAMBIO_NOMBRE_ACCION_AGUA',
      'CAMBIO_NOMBRE_ACCION_ALCANTARILLADO',
      'ASAMBLEA',
      'MULTA',
      'MANTENIMIENTO_ALCANTARILLADO',
      'MANTENIMIENTO_AGUA',
      'TODOS',
    ]),
  })
  .refine((data) => data.fecha_final >= data.fecha_inicio, {
    message: 'La fecha final debe ser mayor o igual a la fecha inicial',
    path: ['fecha_final'],
  });

export const filtroFechasReciboSchema = z
  .object({
    fecha_inicio: fechaIso,
    fecha_final: fechaIso,
    estado: z.enum(['true', 'false']),
    tipo_cobro: filtroFechasCobroSchema.shape.tipo_cobro,
  })
  .refine((data) => data.fecha_final >= data.fecha_inicio, {
    message: 'La fecha final debe ser mayor o igual a la fecha inicial',
    path: ['fecha_final'],
  });