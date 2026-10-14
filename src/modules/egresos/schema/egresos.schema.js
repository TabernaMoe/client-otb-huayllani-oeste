import { z } from 'zod';

const requiredText = (label) =>
  z.string().trim().min(1, `${label} es obligatorio`);

export const categoriaEgresoSchema = z.object({
  nombre_gasto: requiredText('El nombre de la categoría'),
  descripcion: requiredText('La descripción'),
});

export const egresoSchema = z.object({
  categoria_egreso_id: z.coerce
    .number({ message: 'Selecciona una categoría' })
    .int()
    .positive('Selecciona una categoría'),
  fecha: requiredText('La fecha'),
  concepto: requiredText('El concepto'),
  monto: z.coerce
    .number({ message: 'Ingresa un monto válido' })
    .positive('El monto debe ser mayor a 0'),
  beneficiario: requiredText('El beneficiario o proveedor'),
  observaciones: requiredText('Las observaciones'),
});

function validate(schema, form) {
  const result = schema.safeParse(form);

  if (result.success) {
    return { isValid: true, data: result.data, errors: {} };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key && !errors[key]) errors[key] = issue.message;
  }

  return { isValid: false, data: null, errors };
}

export const validateCategoriaEgreso = (form) =>
  validate(categoriaEgresoSchema, form);

export const validateEgreso = (form) => validate(egresoSchema, form);
