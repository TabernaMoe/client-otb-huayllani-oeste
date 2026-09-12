import { z } from 'zod';

const errorsOf = (error) =>
  Object.fromEntries(error.issues.map(({ path, message }) => [path[0], message]));

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
  return result.success
    ? { isValid: true, data: result.data, errors: {} }
    : { isValid: false, data: null, errors: errorsOf(result.error) };
};
