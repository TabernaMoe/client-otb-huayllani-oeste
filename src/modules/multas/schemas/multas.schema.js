import { z } from 'zod';
import { zodErrors } from '../../../utils/zodErrors';
import { formatZodErrorMessage } from '../../../services/error';

export const multaSchema = z.object({
  nombre_multa: z
    .string()
    .trim()
    .min(1, 'Debe ingresar el nombre de la multa'),
  precio: z.coerce.number().positive('El precio debe ser mayor a 0'),
});

export const validateMulta = (form) => {
  const result = multaSchema.safeParse(form);
  if (result.success) {
    return { isValid: true, errors: {}, data: result.data, message: '' };
  }

  return {
    isValid: false,
    errors: zodErrors(result.error),
    data: null,
    message: formatZodErrorMessage(result.error),
  };
};

export const validateCreateMulta = validateMulta;
export const validateEditMulta = validateMulta;

export const asignarMultaSchema = z.object({
  accion_id: z.coerce.number().int().positive('Debe seleccionar una acción'),
  multa_id: z.coerce.number().int().positive('Debe seleccionar una multa'),
});

export const validateAsignarMulta = (form) => {
  const result = asignarMultaSchema.safeParse(form);

  if (!result.success) {
    return {
      isValid: false,
      errors: zodErrors(result.error),
      data: null,
      message: formatZodErrorMessage(result.error),
    };
  }

  return {
    isValid: true,
    errors: {},
    data: {
      accionId: result.data.accion_id,
      payload: { multa_id: result.data.multa_id },
    },
    message: '',
  };
};
