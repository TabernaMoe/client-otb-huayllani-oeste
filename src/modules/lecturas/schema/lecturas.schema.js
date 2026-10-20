import { z } from 'zod';
import { reqInteger, reqString } from '../../../validators/funcionesZod';

export const lecturaSchema = z.object({
  lectura_actual: z
    .string()
    .trim()
    .min(1, 'Ingrese la lectura')
    .transform(Number)
    .pipe(z.number().min(0, 'La lectura no puede ser negativa')),
});

export const validateLectura = (form) => {
  const result = lecturaSchema.safeParse(form);

  if (result.success) return { data: result.data, errors: {} };

  return {
    data: null,
    errors: Object.fromEntries(
      result.error.issues.map((issue) => [issue.path[0], issue.message]),
    ),
  };
};

export const modificarMoraSchema = z.object({
  mora: reqInteger('Mora'),
  observacion_mora: reqString({
    label: 'Observacion',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La observacion contiene caracteres inválidos',
  }),
});

export const updateOblyLecturaSchema = z
  .object({
    lectura_actual: reqInteger('Lectura actual', true, 1),
    lectura_anterior: reqInteger('Lectura anterior', true, 1),
  })
  .refine((data) => data.lectura_actual >= data.lectura_anterior, {
    message: 'La lectura actual no puede ser menor que la lectura anterior',
    path: ['lectura_actual'],
  });
