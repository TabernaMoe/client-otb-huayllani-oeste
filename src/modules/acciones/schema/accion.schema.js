import z from 'zod';
import { reqString, reqInteger } from '../../../validators/funcionesZod';

export const accionSchema = z.object({
  calle_ramal_id: reqInteger('Calle', true, 1),
  socio_id: reqInteger('Socio', true, 1),
  codigo_interno_accion: reqInteger('Codigo interno', true, 1),
  nro_medidor_accion: reqInteger('Numero medidor', true, 1),
  nro_accion: reqInteger('Numero accion', true, 1),
  direccion_acciones: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
  }),
  observaciones_acciones: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
  }),
  order_vizualizacion_acciones: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
  }),
});

export const accionUpdateSchema = accionSchema.partial();
