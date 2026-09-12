import { z } from 'zod';

const usuarioSchema = z.object({
  cargo: z.string().trim().min(1, 'El cargo es obligatorio'),
  cedula_identidad: z.string().trim().min(1, 'La cédula es obligatoria').regex(/^\d+$/, 'La cédula solo admite números'),
  ci_expedido: z.string().trim().min(1, 'El expedido es obligatorio'),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  apellido_paterno: z.string().trim().min(1, 'El apellido paterno es obligatorio'),
  apellido_materno: z.string().trim().min(1, 'El apellido materno es obligatorio'),
  contrasenia: z.string().min(1, 'La contraseña es obligatoria'),
  rol_id: z.coerce.number().positive('Seleccione un rol'),
});

export function validateUsuario(form) {
  const result = usuarioSchema.safeParse(form);
  if (result.success) return { success: true, data: result.data, errors: {} };

  const errors = Object.fromEntries(
    Object.entries(result.error.flatten().fieldErrors).map(([key, value]) => [key, value[0]]),
  );

  return { success: false, data: null, errors };
}
