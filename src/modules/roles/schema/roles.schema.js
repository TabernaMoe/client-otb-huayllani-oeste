import { z } from 'zod';
import { zodErrors } from '../../../utils/zodErrors';
import { formatZodErrorMessage } from '../../../services/error';

const roleSchema = z.object({
  nombre_rol: z.string().trim().min(1, 'El nombre del rol es obligatorio'),
  permisos: z.array(z.number()).min(1, 'Seleccione al menos un permiso'),
});

export function validateRole(form) {
  const result = roleSchema.safeParse(form);
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
