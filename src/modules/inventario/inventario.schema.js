import z from 'zod';
import { reqInteger, reqString } from '../../validators/funcionesZod';

export const inventarioSchema = z.object({
  nombre_producto: reqString({
    label: 'Nombre del producto',
    min: 3,
    max: 100,
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.\-]+$/,
    regexMessage: 'Use letras, números, espacios y los caracteres # . -',
  }),
  saldo_actual: reqInteger('Saldo actual', true, 0),
});
