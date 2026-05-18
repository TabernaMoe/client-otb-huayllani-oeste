import z from 'zod';

export const reqEstadoSocio = (label = 'Estado', required = true) => {
  let schema = z.enum(['HABILITADO', 'DESHABILITADO'], {
    required_error: `Debe seleccionar ${label.toLowerCase()}`,
    invalid_type_error: `Debe seleccionar ${label.toLowerCase()}`,
  });

  if (!required) {
    schema = schema.optional();
  }

  return schema;
};
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
  const valores = ['PASIVO', 'ACTIVO', 'ANULADO'];

  let schema = z
    .string({
      required_error: `Debe seleccionar ${label.toLowerCase()}`,
      invalid_type_error: `Debe seleccionar ${label.toLowerCase()}`,
    })
    .refine((value) => valores.includes(value), {
      message: `Debe seleccionar ${label.toLowerCase()}`,
    });

  if (!required) {
    schema = schema.optional();
  }

  return schema;
};
export const reqDecimal = (label = 'Monto', required = true) => {
  let schema = z.coerce
    .number({
      required_error: `Debe ingresar ${label.toLowerCase()}`,
      invalid_type_error: `${label} debe ser un número`,
    })
    .finite(`${label} debe ser un número válido`)
    .min(1, `${label} debe ser mayor a 0`);

  if (!required) {
    schema = schema.optional();
  }

  return schema;
};

export const reqInteger = (
  label = 'Número',
  required = true,
  min = null,
  max = null,
) => {
  let schema = z.coerce
    .number({
      required_error: `Debe ingresar ${label.toLowerCase()}`,
      invalid_type_error: `${label} debe ser un número`,
    })
    .int(`${label} debe ser un número entero`);

  if (min !== null) {
    schema = schema.min(min, `${label} debe ser mayor o igual a ${min}`);
  }

  if (max !== null) {
    schema = schema.max(max, `${label} debe ser menor o igual a ${max}`);
  }

  if (!required) {
    schema = schema.optional();
  }

  return schema;
};

export const reqIntegerSelect = (
  label = 'Número',
  required = true,
  min = 1,
  max = null,
) => {
  let schema = z
    .union([z.string(), z.number()])
    .refine((value) => value !== '' && value !== null && value !== undefined, {
      message: `Debe ingresar ${label.toLowerCase()}`,
    })
    .refine((value) => !isNaN(Number(value)), {
      message: `Debe ingresar ${label.toLowerCase()}`,
    })
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value), {
      message: `Debe ingresar ${label.toLowerCase()}`,
    })
    .refine((value) => value >= min, {
      message: `${label} no puede ser negativo`,
    });

  if (max !== null) {
    schema = schema.refine((value) => value <= max, {
      message: `${label} debe ser menor o igual a ${max}`,
    });
  }

  if (!required) {
    schema = schema.optional().nullable();
  }

  return schema;
};

export const reqArrayInteger = (label = 'opción', required = true) => {
  let schema = z
    .array(
      z
        .number({
          invalid_type_error: 'Debe seleccionar una opción válida',
        })
        .int('Debe seleccionar una opción válida'),
      {
        required_error: `Debe seleccionar al menos una ${label}`,
        invalid_type_error: `Debe seleccionar al menos una ${label}`,
      },
    )
    .min(1, `Debe seleccionar al menos una ${label}`);

  if (!required) {
    schema = schema.optional();
  }

  return schema;
};
