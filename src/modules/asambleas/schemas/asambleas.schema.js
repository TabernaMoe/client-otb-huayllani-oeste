import { z } from 'zod';

const asambleaSchema = z.object({
  titulo: z.string().trim().min(3, 'Ingrese el título'),
  fecha: z.string().min(1, 'Seleccione la fecha'),
  hora_inicio: z.string().min(1, 'Seleccione la hora'),
  lugar: z.string().trim().min(2, 'Ingrese el lugar'),
  monto_multa: z.coerce.number().min(0, 'Monto inválido'),
  monto_retraso: z.coerce.number().min(0, 'Monto inválido'),
});

const asistenciaSchema = z.object({
  asistio: z.enum(['ASISTIO', 'FALTA', 'SIN EFECTO', 'RETRASO', 'PERMISO']),
  observacion: z.string().trim().max(250, 'Máximo 250 caracteres'),
});

const errorsFrom = (error) =>
  Object.fromEntries(error.issues.map((item) => [item.path[0], item.message]));

export const validateAsamblea = (form) => {
  const result = asambleaSchema.safeParse(form);
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: errorsFrom(result.error) };
};

export const validateAsistencia = (form) => {
  const result = asistenciaSchema.safeParse(form);
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: errorsFrom(result.error) };
};
