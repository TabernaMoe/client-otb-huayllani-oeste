import { z } from 'zod';

const OBSERVACION_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/;

export const lecturaSchema = z.object({
  lectura_actual: z
    .string()
    .trim()
    .min(1, 'Ingrese la lectura actual')
    .transform(Number)
    .pipe(
      z
        .number({ message: 'La lectura debe ser numérica' })
        .int('La lectura debe ser un número entero')
        .min(1, 'La lectura debe ser mayor o igual a 1'),
    ),
  observacion: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || (v.length >= 5 && v.length <= 255), {
      message: 'La observación debe tener entre 5 y 255 caracteres',
    })
    .refine((v) => !v || OBSERVACION_REGEX.test(v), {
      message: 'La observación contiene caracteres inválidos',
    }),
});

export const validateLectura = (form) => {
  const result = lecturaSchema.safeParse(form);

  if (result.success) {
    const payload = { lectura_actual: result.data.lectura_actual };
    if (result.data.observacion) {
      payload.observacion = result.data.observacion;
    }
    return { data: payload, errors: {} };
  }

  return {
    data: null,
    errors: Object.fromEntries(
      result.error.issues.map((issue) => [issue.path[0], issue.message]),
    ),
  };
};
