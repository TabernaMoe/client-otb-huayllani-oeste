import { z } from 'zod';
import { zodErrors } from '../../../utils/zodErrors';
import { formatZodErrorMessage } from '../../../services/error';

const schema = z.object({
  accion_id: z.coerce.number().int().positive('Seleccione una acción'),
  socio_nuevo_id: z.coerce.number().int().positive('Seleccione el nuevo socio'),
  tipo: z.enum(['FAMILIAR', 'AJENO'], { message: 'Seleccione el tipo' }),
  observacion: z.string().trim().min(1, 'Ingrese una observación'),
  monto: z
    .string()
    .trim()
    .min(1, 'Ingrese el monto')
    .regex(/^\d+(\.\d{1,2})?$/, 'Ingrese un monto válido')
    .transform(Number),
});

export const validateCambioNombre = (form) => {
  const result = schema.safeParse(form);
  if (result.success) {
    return { isValid: true, data: result.data, errors: {}, message: '' };
  }

  return {
    isValid: false,
    data: null,
    errors: zodErrors(result.error),
    message: formatZodErrorMessage(result.error),
  };
};
