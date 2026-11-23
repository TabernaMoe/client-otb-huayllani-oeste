import { z } from 'zod';
import { zodErrors } from '../../../utils/zodErrors';
import { formatZodErrorMessage } from '../../../services/error';

const baseUsuarioFields = {
  cargo: z.string().trim().min(2, 'El cargo debe tener al menos 2 caracteres'),
  cedula_identidad: z
    .string()
    .trim()
    .min(5, 'La cédula debe tener al menos 5 dígitos')
    .regex(/^\d+$/, 'La cédula solo admite números'),
  ci_expedido: z.string().trim().min(2, 'El expedido es obligatorio (ej. CB, LP)'),
  nombre: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido_paterno: z
    .string()
    .trim()
    .min(2, 'El apellido paterno debe tener al menos 2 caracteres'),
  apellido_materno: z
    .string()
    .trim()
    .min(2, 'El apellido materno debe tener al menos 2 caracteres'),
  rol_id: z.coerce.number().positive('Seleccione un rol'),
};

const createUsuarioSchema = z.object({
  ...baseUsuarioFields,
  contrasenia: z
    .string()
    .min(3, 'La contraseña debe tener al menos 3 caracteres'),
});

const editUsuarioSchema = z.object({
  ...baseUsuarioFields,
  contrasenia: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || value.length >= 3,
      'La contraseña debe tener al menos 3 caracteres',
    )
    .optional(),
});

export function validateUsuario(form, { isEditing = false } = {}) {
  const schema = isEditing ? editUsuarioSchema : createUsuarioSchema;
  const result = schema.safeParse(form);

  if (result.success) {
    const cleaned = { ...result.data };
    if (isEditing && !cleaned.contrasenia) {
      delete cleaned.contrasenia;
    }
    return { success: true, data: cleaned, errors: {}, message: '' };
  }

  return {
    success: false,
    data: null,
    errors: zodErrors(result.error),
    message: formatZodErrorMessage(result.error),
  };
}
