import { z } from 'zod';
import { zodErrors } from '../../../utils/zodErrors';
import { formatZodErrorMessage } from '../../../services/error';

export const detalleAccionSchema = z.object({
  tipo_accion_id: z.coerce
    .number()
    .int()
    .positive('Selecciona un tipo de acción'),
  nombre_accion: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  precio_accion: z.coerce.number().positive('El precio debe ser mayor a 0'),
  tipo_cobro: z.enum(['UNICO', 'MENSUAL'], {
    message: 'Selecciona un tipo de cobro',
  }),
});

export function validateDetalleAccion(form) {
  const result = detalleAccionSchema.safeParse(form);
  if (result.success) {
    return { success: true, data: result.data, errors: {}, message: '' };
  }

  return {
    success: false,
    data: null,
    errors: zodErrors(result.error),
    message: formatZodErrorMessage(result.error),
  };
}
