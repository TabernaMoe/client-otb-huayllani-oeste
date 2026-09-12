import { z } from 'zod';

const rangoSchema = z.object({
  consumo_minimo: z.coerce.number().min(0, 'El consumo mínimo no puede ser negativo'),
  consumo_maximo: z.preprocess(
    (value) => (value === '' || value === null ? null : Number(value)),
    z.number().min(0, 'El consumo máximo no puede ser negativo').nullable(),
  ),
  precio: z.coerce.number().positive('El precio debe ser mayor a 0'),
});

const tarifaSchema = z
  .object({
    nombre_tarifa: z.string().trim().min(1, 'El nombre es obligatorio'),
    rangosTarifa: z.array(rangoSchema).min(1, 'Debe existir al menos un rango'),
  })
  .superRefine(({ rangosTarifa }, ctx) => {
    rangosTarifa.forEach((rango, index) => {
      const ultimo = index === rangosTarifa.length - 1;

      if (!ultimo && rango.consumo_maximo === null) {
        ctx.addIssue({ code: 'custom', path: ['rangosTarifa', index, 'consumo_maximo'], message: 'El máximo es obligatorio' });
      }

      if (rango.consumo_maximo !== null && rango.consumo_maximo <= rango.consumo_minimo) {
        ctx.addIssue({ code: 'custom', path: ['rangosTarifa', index, 'consumo_maximo'], message: 'Debe ser mayor al mínimo' });
      }

      if (index > 0) {
        const anterior = rangosTarifa[index - 1];
        if (anterior.consumo_maximo !== null && rango.consumo_minimo !== anterior.consumo_maximo + 1) {
          ctx.addIssue({ code: 'custom', path: ['rangosTarifa', index, 'consumo_minimo'], message: `Debe comenzar en ${anterior.consumo_maximo + 1}` });
        }
      }
    });
  });

export function validateTarifa(form) {
  const result = tarifaSchema.safeParse(form);
  if (result.success) return { success: true, data: result.data, errors: {} };

  const errors = {};
  result.error.issues.forEach(({ path, message }) => {
    const key = path[0] === 'rangosTarifa' && path.length === 3 ? `${path[2]}_${path[1]}` : path[0];
    if (!errors[key]) errors[key] = [message];
  });

  return { success: false, data: null, errors };
}
