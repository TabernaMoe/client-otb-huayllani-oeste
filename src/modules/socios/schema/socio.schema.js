import { z } from 'zod';
import { zodErrors } from '../../../utils/zodErrors';
import { formatZodErrorMessage } from '../../../services/error';

const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

export const socioSchema = z.object({
  ci_socio: z
    .string()
    .trim()
    .min(5, 'El CI debe tener al menos 5 dígitos')
    .max(12, 'El CI no puede superar los 12 dígitos')
    .regex(/^\d+$/, 'El CI solo admite números'),
  ci_expedido: z.string().min(1, 'Seleccione el expedido'),
  nombres: z
    .string()
    .trim()
    .min(2, 'Ingrese los nombres (mín. 2 caracteres)')
    .max(100, 'Los nombres no pueden superar 100 caracteres')
    .regex(soloLetras, 'Los nombres solo permiten letras'),
  primer_apellido: z.string().trim(),
  segundo_apellido: z.string().trim(),
  numero_celular: z
    .string()
    .trim()
    .length(8, 'El celular debe tener 8 dígitos')
    .regex(/^\d+$/, 'El celular solo admite números'),
  genero: z.enum(['MASCULINO', 'FEMENINO'], {
    message: 'Seleccione el género',
  }),
  direccion: z
    .string()
    .trim()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(255, 'La dirección no puede superar 255 caracteres'),
});

export const validateSocio = (data) => {
  const result = socioSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: {}, message: '' };
  }

  return {
    success: false,
    data: null,
    errors: zodErrors(result.error),
    message: formatZodErrorMessage(result.error),
  };
};
