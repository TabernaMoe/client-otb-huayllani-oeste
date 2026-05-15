import z from 'zod';
import { reqDecimal, reqString } from '../../../validators/funcionesZod';

export const calleRamalSchema = z.object({
  nombre_calle: reqString({
    label: 'Nombre de la calle',
    min: 2,
    max: 100,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El nombre solo debe contener letras',
  }),
});
