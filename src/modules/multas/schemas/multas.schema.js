import {
  z,
} from 'zod';


/**
 * ============================================================
 * FORMATEAR ERRORES
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
 * MULTA
 * ============================================================
 *
 * POST /admin/multa
 *
 * PATCH /admin/multa/:id
 */
export const multaSchema =
  z.object({

    nombre_multa:
      z
        .string()
        .trim()
        .min(
          1,
          'Debe ingresar el nombre de la multa',
        ),

    precio:
      z.coerce
        .number({
          message:
            'El precio debe ser numérico',
        })
        .positive(
          'El precio debe ser mayor a 0',
        ),
  });


/**
 * ============================================================
 * FUNCIÓN INTERNA CREATE / EDIT
 * ============================================================
 */
const validateMultaData = (
  form,
) => {

  const result =
    multaSchema.safeParse(
      form,
    );


  if (
    !result.success
  ) {

    return {

      isValid:
        false,

      errors:
        formatErrors(
          result.error,
        ),

      data:
        null,
    };
  }


  return {

    isValid:
      true,

    errors:
      {},

    data:
      result.data,
  };
};


/**
 * ============================================================
 * CREATE
 * ============================================================
 */
export const validateCreateMulta = (
  form,
) => {

  return validateMultaData(
    form,
  );
};


/**
 * ============================================================
 * EDIT
 * ============================================================
 */
export const validateEditMulta = (
  form,
) => {

  return validateMultaData(
    form,
  );
};


/**
 * ============================================================
 * ASIGNAR MULTA A UNA ACCIÓN
 * ============================================================
 *
 * Frontend:
 *
 * {
 *   accion_id: 11,
 *   multa_id: 1
 * }
 *
 * Backend:
 *
 * URL:
 * /admin/cobro/multas/11
 *
 * BODY:
 *
 * {
 *   multa_id: 1
 * }
 */
export const asignarMultaSchema =
  z.object({

    accion_id:
      z.coerce
        .number({
          message:
            'Debe seleccionar una acción',
        })
        .int(
          'La acción debe ser válida',
        )
        .positive(
          'Debe seleccionar una acción',
        ),

    multa_id:
      z.coerce
        .number({
          message:
            'Debe seleccionar una multa',
        })
        .int(
          'La multa debe ser válida',
        )
        .positive(
          'Debe seleccionar una multa',
        ),
  });


/**
 * ============================================================
 * VALIDAR ASIGNACIÓN
 * ============================================================
 */
export const validateAsignarMulta = (
  form,
) => {

  const result =
    asignarMultaSchema.safeParse(
      form,
    );


  if (
    !result.success
  ) {

    return {

      isValid:
        false,

      errors:
        formatErrors(
          result.error,
        ),

      data:
        null,
    };
  }


  return {

    isValid:
      true,

    errors:
      {},

    data: {

      /**
       * Va en la URL.
       */
      accionId:
        result.data.accion_id,

      /**
       * Va en el BODY.
       */
      payload: {

        multa_id:
          result.data.multa_id,
      },
    },
  };
};