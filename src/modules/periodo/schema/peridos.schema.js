import { z } from 'zod';


// ==============================
// AÑO
// ==============================

const anioSchema = z.coerce
  .number({
    invalid_type_error:
      'El año debe ser numérico',
  })
  .int(
    'El año debe ser un número entero',
  )
  .min(2000, 'El año no es válido')
  .max(2100, 'El año no es válido');


// ==============================
// GESTIÓN
// ==============================

export const gestionFormSchema = z.object({
  anio: anioSchema,
});

export const gestionIdSchema = z.coerce
  .number()
  .int(
    'El identificador de la gestión debe ser entero',
  )
  .positive(
    'El identificador de la gestión no es válido',
  );


// ==============================
// PERIODOS
// ==============================

export const periodoIdSchema = z.coerce
  .number()
  .int(
    'El identificador del periodo debe ser entero',
  )
  .positive(
    'El identificador del periodo no es válido',
  );


// ==============================
// PAGINACIÓN GESTIÓN
// ==============================

export const gestionParamsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  search: z
    .string()
    .trim()
    .default(''),
});


// ==============================
// PAGINACIÓN PERIODOS
// ==============================

export const periodoParamsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),
});