import { z } from 'zod';

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
