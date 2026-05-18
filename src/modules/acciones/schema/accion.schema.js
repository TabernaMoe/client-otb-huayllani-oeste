import z from 'zod';
import {
  reqString,
  reqInteger,
  reqEstadoAccion,
  reqIntegerSelect,
  reqArrayInteger,
} from '../../../validators/funcionesZod';

export const accionSchema = z.object({
  socio_id: reqIntegerSelect('Socio'),
  calle_id: reqIntegerSelect('Calle'),
  acciones: reqArrayInteger(),
  codigo_interno_accion: reqInteger('Codigo interno', true, 1),
  nro_medidor_accion: reqInteger('Numero medidor', true, 1),
  nro_accion: reqInteger('Numero accion', true, 1),
  direccion_accion: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
  }),
  observacion_accion: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
  }),
  estado_accion: reqEstadoAccion(),
});

export const accionUpdateSchema = accionSchema.partial();
