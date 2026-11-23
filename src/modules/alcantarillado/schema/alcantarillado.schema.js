import { z } from 'zod';
import { zodErrors } from '../../../utils/zodErrors';
import { formatZodErrorMessage } from '../../../services/error';

const schema = z.object({
  nombre_accion: z.string().trim().min(1, 'Ingrese el nombre'),
  precio_accion: z
    .string()
    .trim()
    .min(1, 'Ingrese el precio')
    .regex(/^\d+(\.\d{1,2})?$/, 'Ingrese un precio válido'),
  tipo_cobro: z.enum(['UNICO', 'MENSUAL'], {
    message: 'Seleccione el tipo de cobro',
  }),
});

export const validateAlcantarillado = (form) => {
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
