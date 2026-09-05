import {
  z,
} from 'zod';


/**
 * ============================================================
 * ACCIÓN
 * ============================================================
 */

export const accionSchema =
  z.object({

    socio_id:
      z.coerce
        .number()
        .int(
          'Debe seleccionar un socio válido',
        )
        .positive(
          'Debe seleccionar un socio',
        ),


    calle_id:
      z.coerce
        .number()
        .int(
          'Debe seleccionar una calle válida',
        )
        .positive(
          'Debe seleccionar una calle',
        ),


    tarifa_id:
      z.coerce
        .number()
        .int(
          'Debe seleccionar una tarifa válida',
        )
        .positive(
          'Debe seleccionar una tarifa',
        ),


    nro_medidor:
      z.string()
        .trim()
        .min(
          1,
          'El número de medidor es obligatorio',
        )
        .max(
          50,
          'El número de medidor es muy largo',
        ),


    direccion:
      z.string()
        .trim()
        .min(
          1,
          'La dirección es obligatoria',
        )
        .max(
          255,
          'La dirección es muy larga',
        ),


    observacion:
      z.string()
        .trim()
        .max(
          500,
          'La observación es muy larga',
        )
        .optional()
        .or(
          z.literal(''),
        ),


    estado:
      z.enum(
        [
          'ACTIVO',
          'PASIVO',
          'ANULADO',
        ],
        {
          message:
            'Debe seleccionar un estado válido',
        },
      ),


    detallesAccion:
      z.array(
        z.coerce
          .number()
          .int()
          .positive(),
      )
        .min(
          1,
          'Debe seleccionar al menos un detalle de acción',
        ),

  });


/**
 * ============================================================
 * PARÁMETROS LISTADO
 * ============================================================
 */

export const accionParamsSchema =
  z.object({

    page:
      z.coerce
        .number()
        .int()
        .min(
          1,
          'La página debe ser mayor o igual a 1',
        )
        .default(1),


    limit:
      z.coerce
        .number()
        .int()
        .min(1)
        .max(
          100,
          'El límite máximo es 100',
        )
        .default(10),


    search:
      z.string()
        .trim()
        .default(''),


    estado:
      z.enum([
        'ACTIVO',
        'PASIVO',
        'ANULADO',
      ])
        .optional(),

  });


/**
 * ============================================================
 * ID
 * ============================================================
 */

export const accionIdSchema =
  z.coerce
    .number()
    .int(
      'El identificador debe ser entero',
    )
    .positive(
      'El identificador no es válido',
    );


/**
 * ============================================================
 * CAMBIAR ESTADO
 * ============================================================
 */

export const accionEstadoSchema =
  z.object({

    estado:
      z.enum(
        [
          'ACTIVO',
          'PASIVO',
          'ANULADO',
        ],
        {
          message:
            'El estado no es válido',
        },
      ),

  });


/**
 * ============================================================
 * CAMBIAR NOMBRE / PROPIETARIO
 * ============================================================
 */

export const cambiarNombreAccionSchema =
  z.object({

    nuevoSocioId:
      z.coerce
        .number()
        .int(
          'El socio debe ser válido',
        )
        .positive(
          'Debe seleccionar el nuevo socio',
        ),


    tipo:
      z.enum(
        [
          'FAMILIAR',
          'PARTICULAR',
        ],
        {
          message:
            'Debe seleccionar un tipo válido',
        },
      ),

  });


/**
 * ============================================================
 * CONVERTIR ERRORES ZOD
 * ============================================================
 */

const formatErrors = (
  zodError,
) => {

  const errors = {};

  const issues =
    zodError?.issues || [];


  issues.forEach(
    (issue) => {

      const field =
        issue.path?.[0];


      if (
        field &&
        !errors[field]
      ) {

        errors[field] =
          issue.message;

      }

    },
  );


  return errors;
};


/**
 * ============================================================
 * VALIDAR ACCIÓN
 * ============================================================
 */

export const validateAccion = (
  data,
) => {

  const normalizedData = {

    ...data,

    estado:
      String(
        data?.estado ||
          'ACTIVO',
      )
        .trim()
        .toUpperCase(),

  };


  const result =
    accionSchema.safeParse(
      normalizedData,
    );


  if (
    result.success
  ) {

    return {

      isValid: true,

      errors: {},

      data:
        result.data,

    };

  }


  return {

    isValid: false,

    errors:
      formatErrors(
        result.error,
      ),

    data: null,

  };
};


/**
 * ============================================================
 * VALIDAR LISTADO
 * ============================================================
 */

export const validateAccionParams = (
  data,
) => {

  const normalizedData = {

    ...data,

    estado:
      data?.estado
        ? String(
            data.estado,
          )
            .trim()
            .toUpperCase()
        : undefined,

  };


  const result =
    accionParamsSchema.safeParse(
      normalizedData,
    );


  if (
    result.success
  ) {

    return {

      isValid: true,

      errors: {},

      data:
        result.data,

    };

  }


  return {

    isValid: false,

    errors:
      formatErrors(
        result.error,
      ),

    data: null,

  };
};


/**
 * ============================================================
 * VALIDAR ID
 * ============================================================
 */

export const validateAccionId = (
  id,
) => {

  const result =
    accionIdSchema.safeParse(
      id,
    );


  if (
    result.success
  ) {

    return {

      isValid: true,

      data:
        result.data,

      error: null,

    };

  }


  return {

    isValid: false,

    data: null,

    error:
      result.error
        ?.issues?.[0]
        ?.message ||
      'Identificador inválido',

  };
};


/**
 * ============================================================
 * VALIDAR ESTADO
 * ============================================================
 */

export const validateAccionEstado = (
  data,
) => {

  const normalizedData = {

    estado:
      String(
        data?.estado ||
          '',
      )
        .trim()
        .toUpperCase(),

  };


  const result =
    accionEstadoSchema.safeParse(
      normalizedData,
    );


  if (
    result.success
  ) {

    return {

      isValid: true,

      errors: {},

      data:
        result.data,

    };

  }


  return {

    isValid: false,

    errors:
      formatErrors(
        result.error,
      ),

    data: null,

  };
};


/**
 * ============================================================
 * VALIDAR CAMBIO DE NOMBRE
 * ============================================================
 */

export const validateCambioNombreAccion = (
  data,
) => {

  const normalizedData = {

    nuevoSocioId:
      data?.nuevoSocioId,

    tipo:
      String(
        data?.tipo ||
          '',
      )
        .trim()
        .toUpperCase(),

  };


  const result =
    cambiarNombreAccionSchema.safeParse(
      normalizedData,
    );


  if (
    result.success
  ) {

    return {

      isValid: true,

      errors: {},

      data:
        result.data,

    };

  }


  return {

    isValid: false,

    errors:
      formatErrors(
        result.error,
      ),

    data: null,

  };
};