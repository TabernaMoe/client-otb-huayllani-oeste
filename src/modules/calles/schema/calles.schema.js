import { z } from 'zod';
import { zodErrors } from '../../../utils/zodErrors';
import { formatZodErrorMessage } from '../../../services/error';

export const calleSchema = z.object({
  nombre_calle: z
    .string()
    .trim()
    .min(2, 'El nombre de la calle debe tener al menos 2 caracteres')
    .max(150, 'El nombre de la calle no puede superar 150 caracteres'),
});

export function validateCalle(form) {
  const result = calleSchema.safeParse(form);
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
