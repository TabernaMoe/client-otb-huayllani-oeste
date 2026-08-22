import { z } from 'zod';

const textoSoloLetras =
  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

export const socioSchema = z.object({
  ci_socio: z
    .string()
    .trim()
    .min(
      5,
      'El CI debe tener mínimo 5 dígitos',
    )
    .max(
      12,
      'El CI debe tener máximo 12 dígitos',
    )
    .regex(
      /^\d+$/,
      'El CI solo debe contener números',
    ),

  ci_expedido: z
    .string()
    .trim()
    .min(
      1,
      'Debe seleccionar el expedido',
    ),

  nombres: z
    .string()
    .trim()
    .min(
      2,
      'El nombre debe tener mínimo 2 caracteres',
    )
    .max(
      100,
      'El nombre debe tener máximo 100 caracteres',
    )
    .regex(
      textoSoloLetras,
      'El nombre solo debe contener letras',
    ),

  primer_apellido: z
    .string()
    .trim()
    .min(
      2,
      'El primer apellido debe tener mínimo 2 caracteres',
    )
    .max(
      100,
      'El primer apellido debe tener máximo 100 caracteres',
    )
    .regex(
      textoSoloLetras,
      'El apellido solo debe contener letras',
    ),

  segundo_apellido: z
    .string()
    .trim()
    .max(
      100,
      'El segundo apellido debe tener máximo 100 caracteres',
    )
    .refine(
      (value) =>
        value === '' ||
        textoSoloLetras.test(value),
      {
        message:
          'El segundo apellido solo debe contener letras',
      },
    )
    .optional()
    .or(z.literal('')),

  numero_celular: z
    .string()
    .trim()
    .min(
      8,
      'El celular debe tener mínimo 8 dígitos',
    )
    .regex(
      /^\d+$/,
      'El celular solo debe contener números',
    ),

  genero: z
    .string()
    .trim()
    .min(
      1,
      'Debe seleccionar el género',
    ),

  direccion: z
    .string()
    .trim()
    .min(
      5,
      'La dirección debe tener mínimo 5 caracteres',
    )
    .max(
      255,
      'La dirección debe tener máximo 255 caracteres',
    ),
});

export const updateSocioSchema =
  socioSchema.partial();