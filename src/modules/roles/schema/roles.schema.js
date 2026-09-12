import { z } from 'zod';

const roleSchema = z.object({
  nombre_rol: z.string().trim().min(1, 'El nombre del rol es obligatorio'),
  permisos: z.array(z.number()).min(1, 'Seleccione al menos un permiso'),
});

export function validateRole(form) {
  const result = roleSchema.safeParse(form);
  if (result.success) return { success: true, data: result.data, errors: {} };

  const errors = Object.fromEntries(
    Object.entries(result.error.flatten().fieldErrors).map(([key, value]) => [key, value[0]]),
  );

  return { success: false, data: null, errors };
}
