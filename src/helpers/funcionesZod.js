import z from 'zod';

export const reqFecha = (label = 'Fecha', required = true) => {
  let schema = z
    .string({
      required_error: 'Debe llenar este espacio',
      invalid_type_error: 'Debe llenar este espacio',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} debe tener formato AAAA-MM-DD`);

  if (required) {
    schema = schema.min(1, 'Debe llenar este espacio');
  } else {
    schema = schema.optional().or(z.literal(''));
  }

  return schema;
};
export const reqCi = (label = 'Cédula de identidad', required = true) => {
  let schema = z
    .string({
      required_error: `Debe ingresar ${label.toLowerCase()}`,
      invalid_type_error: `Debe ingresar ${label.toLowerCase()}`,
    })
    .trim()
    .regex(/^[0-9]{5,12}$/, `${label} debe contener solo números`);

  if (required) {
    schema = schema.min(1, `Debe ingresar ${label.toLowerCase()}`);
  } else {
    schema = schema.optional().or(z.literal(''));
  }

  return schema;
};
export const reqExpedidoCi = (label = 'Expedido', required = true) => {
  const departamentos = ['LP', 'CB', 'SC', 'OR', 'PT', 'CH', 'TJ', 'BN', 'PD'];

  let schema = z
    .string({
      required_error: `Debe seleccionar ${label.toLowerCase()}`,
      invalid_type_error: `Debe seleccionar ${label.toLowerCase()}`,
    })
    .trim()
    .toUpperCase()
    .refine((value) => departamentos.includes(value), `${label} no es válido`);

  if (!required) {
    schema = schema.optional().or(z.literal(''));
  }

  return schema;
};
export const reqString = ({
  label = 'Campo',
  required = true,
  min = 1,
  max,
  regex,
  regexMessage = 'Formato inválido',
} = {}) => {
  let schema = z
    .string({
      required_error: `Debe ingresar ${label.toLowerCase()}`,
      invalid_type_error: `Debe ingresar ${label.toLowerCase()}`,
    })
    .trim();

  if (min) {
    schema = schema.min(min, `${label} debe tener al menos ${min} caracteres`);
  }

  if (max) {
    schema = schema.max(max, `${label} debe tener máximo ${max} caracteres`);
  }

  if (regex) {
    schema = schema.regex(regex, regexMessage);
  }

  if (!required) {
    return z.preprocess(
      (value) => (value === '' ? undefined : value),
      schema.optional(),
    );
  }

  return schema;
};
export const reqCelular = (label = 'Número de celular', required = true) => {
  let schema = z
    .string({
      required_error: `Debe ingresar ${label.toLowerCase()}`,
      invalid_type_error: `Debe ingresar ${label.toLowerCase()}`,
    })
    .trim()
    .regex(/^[0-9]{8}$/, `${label} debe contener 8 dígitos`);

  if (required) {
    schema = schema.min(1, `Debe ingresar ${label.toLowerCase()}`);
  } else {
    schema = schema.optional().or(z.literal(''));
  }

  return schema;
};
export const reqGenero = (label = 'Género', required = true) => {
  let schema = z.enum(['MASCULINO', 'FEMENINO'], {
    required_error: `Debe seleccionar ${label.toLowerCase()}`,
    invalid_type_error: `Debe seleccionar ${label.toLowerCase()}`,
  });

  if (!required) {
    schema = schema.optional();
  }

  return schema;
};
export const reqEstadoAccion = (label = 'Estado', required = true) => {
  let schema = z.enum(['PASIVO', 'ACTIVO', 'ANULADO'], {
    required_error: `Debe seleccionar ${label.toLowerCase()}`,
    invalid_type_error: `Debe seleccionar ${label.toLowerCase()}`,
  });

  if (!required) {
    schema = schema.optional();
  }

  return schema;
};
