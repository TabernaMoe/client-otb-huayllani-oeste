import { z } from 'zod';

export const periodoIdSchema = z.coerce
  .number()
  .int('El identificador debe ser entero')
  .positive('El período no es válido');
