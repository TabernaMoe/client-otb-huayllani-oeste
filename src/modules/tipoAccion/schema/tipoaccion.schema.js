import { z } from 'zod';
import { zodErrors } from '../../../utils/zodErrors';
import { formatZodErrorMessage } from '../../../services/error';

export const tipoAccionSchema = z.object({
  nombre_tipo_accion: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
});

export function validateTipoAccion(form) {
  const result = tipoAccionSchema.safeParse(form);
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
