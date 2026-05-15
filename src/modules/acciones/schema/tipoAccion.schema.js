import z from 'zod';
import { reqDecimal, reqString } from '../../../validators/funcionesZod';

export const tipoAccionSchema = z.object({
  nombre_tipos_acciones: reqString({
    label: 'Nombre del tipo de acción',
    min: 2,
    max: 100,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El nombre solo debe contener letras',
  }),
  costo_tipos_acciones: reqDecimal('Costo del tipo de acción', true),
});

export const updateTipoAccionSchema = tipoAccionSchema.partial();
