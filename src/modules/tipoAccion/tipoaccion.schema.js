import z from 'zod';
import { reqString } from '../../validators/funcionesZod';

export const tipoAccionSchema = z.object({
  nombre_tipo_accion: reqString({
    label: 'Tipo accion',
    min: 3,
    max: 100,
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.\-]+$/,
    regexMessage:
      'El nombre del tipo accion solo puede contener letras, números, espacios y los caracteres # . -',
  }),
});
