import z from 'zod';

export const socioSchema = z.object({
  ci_socio: z
    .string()
    .min(5, 'El CI debe tener mínimo 5 dígitos')
    .max(12, 'El CI debe tener máximo 12 dígitos')
    .regex(/^\d+$/, 'El CI solo debe contener números'),

  ci_expedido: z.string().min(1, 'Debe seleccionar el expedido'),

  nombres: z
    .string()
    .min(2, 'El nombre debe tener mínimo 2 caracteres')
    .max(100, 'El nombre debe tener máximo 100 caracteres')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'El nombre solo debe contener letras'),

  primer_apellido: z
    .string()
    .min(2, 'El primer apellido debe tener mínimo 2 caracteres')
    .max(100, 'El primer apellido debe tener máximo 100 caracteres')
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      'El apellido solo debe contener letras',
    ),

  segundo_apellido: z
    .string()
    .max(100, 'El segundo apellido debe tener máximo 100 caracteres')
    .optional()
    .or(z.literal('')),

  numero_celular: z
    .string()
    .min(7, 'El celular debe tener mínimo 7 dígitos')
    .max(8, 'El celular debe tener máximo 8 dígitos')
    .regex(/^\d+$/, 'El celular solo debe contener números'),

  genero: z.string().min(1, 'Debe seleccionar el género'),

  direccion: z
    .string()
    .min(5, 'La dirección debe tener mínimo 5 caracteres')
    .max(255, 'La dirección debe tener máximo 255 caracteres'),
});

export const updateSocioSchema = socioSchema.partial();