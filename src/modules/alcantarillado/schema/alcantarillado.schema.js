import { z } from 'zod';

const errorsOf = (error) =>
  Object.fromEntries(error.issues.map(({ path, message }) => [path[0], message]));

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
  return result.success
    ? { isValid: true, data: result.data, errors: {} }
    : { isValid: false, data: null, errors: errorsOf(result.error) };
};
