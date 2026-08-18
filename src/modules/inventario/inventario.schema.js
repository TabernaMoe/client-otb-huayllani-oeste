import z from 'zod';
import { reqString, reqInteger } from '../../validators/funcionesZod.js';

export const inventaioSchema = z.object({
  nombre_producto: reqString({
    label: 'Nombre tip accion',
    min: 3,
    max: 100,
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.\-]+$/,
    regexMessage:
      'El nombre del tipo accion solo puede contener letras, números, espacios y los caracteres # . -',
  }),
  saldo_actual: reqInteger('Saldo actual'),
});

export const inventarioUpdateSchema = inventaioSchema.partial();
