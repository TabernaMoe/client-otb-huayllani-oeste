import { z } from 'zod';
import { zodErrors } from '../../../utils/zodErrors';
import { formatZodErrorMessage } from '../../../services/error';

const asambleaSchema = z.object({
  titulo: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres'),
  fecha: z.string().min(1, 'Seleccione la fecha'),
  hora_inicio: z.string().min(1, 'Seleccione la hora de inicio'),
  lugar: z.string().trim().min(2, 'Ingrese el lugar'),
  monto_multa: z.coerce.number().min(0, 'El monto de multa es inválido'),
  monto_retraso: z.coerce.number().min(0, 'El monto de retraso es inválido'),
});

const asistenciaSchema = z.object({
  asistio: z.enum(['ASISTIO', 'FALTA', 'SIN EFECTO', 'RETRASO', 'PERMISO']),
  observacion: z
    .string({ required_error: 'La observación es obligatoria' })
    .trim()
    .min(1, 'La observación es obligatoria')
    .max(250, 'Máximo 250 caracteres'),
});

export const validateAsamblea = (form) => {
  const result = asambleaSchema.safeParse(form);
  if (result.success) {
    return { ok: true, data: result.data, errors: {}, message: '' };
  }
  return {
    ok: false,
    errors: zodErrors(result.error),
    message: formatZodErrorMessage(result.error),
  };
};

export const validateAsistencia = (form) => {
  const result = asistenciaSchema.safeParse(form);
  if (result.success) {
    return { ok: true, data: result.data, errors: {}, message: '' };
  }
  return {
    ok: false,
    errors: zodErrors(result.error),
    message: formatZodErrorMessage(result.error),
  };
};
