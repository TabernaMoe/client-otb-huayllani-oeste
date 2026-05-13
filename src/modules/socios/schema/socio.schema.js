import z from 'zod';
import {
  reqCelular,
  reqCi,
  reqExpedidoCi,
  reqFecha,
  reqString,
  reqGenero,
  reqEstadoSocio,
} from '../../../validators/funcionesZod';

export const socioSchema = z.object({
  ci_socio: reqCi(),
  ci_expedido_socio: reqExpedidoCi(),
  nombres_socio: reqString({
    label: 'Nombre del socio',
    min: 2,
    max: 100,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El nombre solo debe contener letras',
  }),
  primer_apellido_socio: reqString({
    label: 'Primer apellido',
    min: 2,
    max: 100,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El apellido solo debe contener letras',
  }),
  segundo_apellido_socio: reqString({
    label: 'Segundo apellido',
    min: 2,
    max: 100,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El apellido solo debe contener letras',
  }),
  numero_celular_socio: reqCelular(),
  numero_telefono_socio: reqCelular('Telefono', false),
  genero_socio: reqGenero(),
  estado_socio: reqEstadoSocio(),
  direccion_socio: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
  }),
});
export const updateSocioSchema = socioSchema.partial();
