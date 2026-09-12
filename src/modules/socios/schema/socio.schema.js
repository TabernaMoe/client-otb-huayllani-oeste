import { z } from 'zod';

const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

export const socioSchema = z.object({
  ci_socio: z.string().trim().min(5, 'Ingrese un CI válido').max(12, 'Ingrese un CI válido').regex(/^\d+$/, 'El CI solo admite números'),
  ci_expedido: z.string().min(1, 'Seleccione el expedido'),
  nombres: z.string().trim().min(2, 'Ingrese los nombres').max(100).regex(soloLetras, 'Solo se permiten letras'),
  primer_apellido: z.string().trim().min(2, 'Ingrese el primer apellido').max(100).regex(soloLetras, 'Solo se permiten letras'),
  segundo_apellido: z.string().trim().max(100).refine((value) => !value || soloLetras.test(value), 'Solo se permiten letras'),
  numero_celular: z.string().trim().length(8, 'El celular debe tener 8 dígitos').regex(/^\d+$/, 'El celular solo admite números'),
  genero: z.enum(['MASCULINO', 'FEMENINO'], { message: 'Seleccione el género' }),
  direccion: z.string().trim().min(5, 'Ingrese la dirección').max(255),
});

export const validateSocio = (data) => {
  const result = socioSchema.safeParse(data);
  return result.success
    ? { success: true, data: result.data, errors: {} }
    : { success: false, data: null, errors: result.error.flatten().fieldErrors };
};
