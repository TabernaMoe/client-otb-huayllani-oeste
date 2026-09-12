import { z } from 'zod';

const formatErrors = (error) =>
  Object.fromEntries(error.issues.map((issue) => [issue.path[0], issue.message]));

export const multaSchema = z.object({
  nombre_multa: z.string().trim().min(1, 'Debe ingresar el nombre de la multa'),
  precio: z.coerce.number().positive('El precio debe ser mayor a 0'),
});

export const validateMulta = (form) => {
  const result = multaSchema.safeParse(form);

  return result.success
    ? { isValid: true, errors: {}, data: result.data }
    : { isValid: false, errors: formatErrors(result.error), data: null };
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
    return { isValid: false, errors: formatErrors(result.error), data: null };
  }

  return {
    isValid: true,
    errors: {},
    data: {
      accionId: result.data.accion_id,
      payload: { multa_id: result.data.multa_id },
    },
  };
};
