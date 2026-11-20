import { z } from 'zod';

export const cambiarContrasenaSchema = z
  .object({
    contrasenia_actual: z
      .string()
      .min(4, 'Ingresa tu contraseña actual'),
    contrasenia_nueva: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .max(100, 'La contraseña es demasiado larga'),
    confirmar: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((data) => data.contrasenia_nueva === data.confirmar, {
    message: 'Las contraseñas nuevas no coinciden',
    path: ['confirmar'],
  })
  .refine((data) => data.contrasenia_actual !== data.contrasenia_nueva, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['contrasenia_nueva'],
  });

export const editarPerfilSchema = z.object({
  numero_celular: z
    .string()
    .trim()
    .min(7, 'El celular debe tener al menos 7 dígitos')
    .max(20, 'El celular es demasiado largo')
    .regex(/^[0-9+\-\s]+$/, 'Ingresa un número de celular válido'),
  direccion: z
    .string()
    .trim()
    .min(4, 'La dirección debe tener al menos 4 caracteres')
    .max(200, 'La dirección es demasiado larga'),
});
