import { z } from 'zod';

/**
 * ============================================================
 * SCHEMA DE UN RANGO
 * ============================================================
 *
 * Representa:
 *
 * {
 *   consumo_minimo: 0,
 *   consumo_maximo: 10,
 *   precio: 5
 * }
 *
 * IMPORTANTE:
 *
 * consumo_maximo puede ser null
 * solamente para el ÚLTIMO rango.
 *
 * Esa regla se comprobará más abajo
 * porque el schema de un rango individual
 * no sabe si es el último.
 */
const rangoTarifaSchema = z.object({
  /**
   * ==========================================================
   * CONSUMO MÍNIMO
   * ==========================================================
   *
   * z.coerce permite:
   *
   * "0" -> 0
   */
  consumo_minimo: z.coerce
    .number({
      invalid_type_error:
        'El consumo mínimo debe ser numérico',
    })
    .min(
      0,
      'Debe ser mayor o igual a 0',
    ),

  /**
   * ==========================================================
   * CONSUMO MÁXIMO
   * ==========================================================
   *
   * preprocess nos permite convertir:
   *
   * ""
   *
   * en:
   *
   * null
   *
   * porque el último rango puede
   * no tener límite superior.
   */
  consumo_maximo: z.preprocess(
    (value) => {
      if (
        value === '' ||
        value === null ||
        value === undefined
      ) {
        return null;
      }

      return Number(value);
    },

    z
      .number({
        invalid_type_error:
          'El consumo máximo debe ser numérico',
      })
      .min(
        0,
        'Debe ser mayor o igual a 0',
      )
      .nullable(),
  ),

  /**
   * ==========================================================
   * PRECIO
   * ==========================================================
   */
  precio: z.coerce
    .number({
      invalid_type_error:
        'El precio debe ser numérico',
    })
    .positive(
      'Debe ser mayor a 0',
    ),
});

/**
 * ============================================================
 * SCHEMA PRINCIPAL DE TARIFA
 * ============================================================
 */
export const tarifaSchema = z.object({
  /**
   * Nombre.
   */
  nombre_tarifa: z
    .string()
    .trim()
    .min(
      1,
      'El nombre de la tarifa es obligatorio',
    )
    .max(
      100,
      'El nombre de la tarifa es demasiado largo',
    ),

  /**
   * Debe existir como mínimo un rango.
   */
  rangosTarifa: z
    .array(
      rangoTarifaSchema,
    )
    .min(
      1,
      'Debe agregar al menos un rango',
    ),
});

/**
 * ============================================================
 * QUERY PARAMS
 * ============================================================
 *
 * Ejemplo:
 *
 * {
 *   page: 1,
 *   limit: 5,
 *   search: '',
 *   estado: true
 * }
 */
export const tarifaParamsSchema = z.object({
  page: z.coerce
    .number()
    .int(
      'La página debe ser un número entero',
    )
    .min(
      1,
      'La página debe ser mayor o igual a 1',
    )
    .default(1),

  limit: z.coerce
    .number()
    .int(
      'El límite debe ser un número entero',
    )
    .min(
      1,
      'El límite debe ser mayor o igual a 1',
    )
    .max(
      100,
      'El límite máximo es 100',
    )
    .default(5),

  search: z
    .string()
    .trim()
    .default(''),

  /**
   * true  -> activas
   * false -> inactivas
   *
   * undefined -> todas
   */
  estado: z
    .boolean()
    .optional(),
});

/**
 * ============================================================
 * ID DE TARIFA
 * ============================================================
 */
export const tarifaIdSchema = z.coerce
  .number()
  .int(
    'El ID debe ser un número entero',
  )
  .positive(
    'El identificador de la tarifa no es válido',
  );

/**
 * ============================================================
 * CONVERTIR ERRORES DE ZOD
 * ============================================================
 *
 * Esta función es INTERNA.
 *
 * No se importa en React.
 */
const formatZodErrors = (
  zodError,
) => {
  const errors = {};

  const issues =
    zodError?.issues || [];

  issues.forEach(
    (issue) => {
      /**
       * Ejemplo de path:
       *
       * ['nombre_tarifa']
       *
       * o:
       *
       * ['rangosTarifa', 0, 'precio']
       */
      const path =
        issue.path || [];

      /**
       * Error del nombre.
       */
      if (
        path[0] ===
        'nombre_tarifa'
      ) {
        if (
          !errors.nombre_tarifa
        ) {
          errors.nombre_tarifa =
            issue.message;
        }

        return;
      }

      /**
       * Error general de rangos.
       */
      if (
        path[0] ===
          'rangosTarifa' &&
        path.length === 1
      ) {
        errors.rangosTarifa =
          issue.message;

        return;
      }

      /**
       * Error de un rango específico.
       *
       * Ejemplo:
       *
       * ['rangosTarifa', 0, 'precio']
       *
       * se convierte en:
       *
       * precio_0
       */
      if (
        path[0] ===
          'rangosTarifa' &&
        typeof path[1] ===
          'number' &&
        path[2]
      ) {
        const index =
          path[1];

        const field =
          path[2];

        const key =
          `${field}_${index}`;

        if (
          !errors[key]
        ) {
          errors[key] =
            issue.message;
        }
      }
    },
  );

  return errors;
};

/**
 * ============================================================
 * VALIDAR TARIFA COMPLETA
 * ============================================================
 *
 * ESTA es la función que importa TarifaModal.
 *
 * Aquí utilizamos Zod primero y después
 * verificamos reglas que dependen
 * de la relación entre varios rangos.
 */
export const validateTarifaForm = (
  form,
) => {
  /**
   * ==========================================================
   * PASO 1
   * VALIDACIÓN BÁSICA CON ZOD
   * ==========================================================
   */
  const result =
    tarifaSchema.safeParse(
      form,
    );

  /**
   * Si Zod falla,
   * convertimos sus errores.
   */
  if (
    !result.success
  ) {
    return {
      isValid: false,

      errors:
        formatZodErrors(
          result.error,
        ),

      data: null,
    };
  }

  /**
   * ==========================================================
   * PASO 2
   * DATOS YA TRANSFORMADOS
   * ==========================================================
   *
   * En este punto:
   *
   * "10" -> 10
   *
   * "" -> null
   */
  const data =
    result.data;

  const errors = {};

  const rangos =
    data.rangosTarifa;

  /**
   * ==========================================================
   * PASO 3
   * REGLAS ENTRE RANGOS
   * ==========================================================
   */
  rangos.forEach(
    (
      rango,
      index,
    ) => {
      const esUltimo =
        index ===
        rangos.length - 1;

      /**
       * ========================================================
       * LOS RANGOS INTERMEDIOS NECESITAN MÁXIMO
       * ========================================================
       *
       * Solo el último puede ser:
       *
       * consumo_maximo = null
       */
      if (
        !esUltimo &&
        rango.consumo_maximo ===
          null
      ) {
        errors[
          `consumo_maximo_${index}`
        ] =
          'El consumo máximo es obligatorio';
      }

      /**
       * ========================================================
       * MÁXIMO DEBE SER MAYOR AL MÍNIMO
       * ========================================================
       */
      if (
        rango.consumo_maximo !==
          null &&
        rango.consumo_maximo <=
          rango.consumo_minimo
      ) {
        errors[
          `consumo_maximo_${index}`
        ] =
          'Debe ser mayor al consumo mínimo';
      }

      /**
       * ========================================================
       * CONTINUIDAD
       * ========================================================
       *
       * Ejemplo correcto:
       *
       * 0 - 10
       *
       * 11 - 20
       *
       * 21 - null
       */
      if (
        index > 0
      ) {
        const anterior =
          rangos[
            index - 1
          ];

        /**
         * El rango anterior,
         * si no es el último,
         * debería tener máximo.
         */
        if (
          anterior.consumo_maximo !==
          null
        ) {
          const esperado =
            anterior.consumo_maximo +
            1;

          if (
            rango.consumo_minimo !==
            esperado
          ) {
            errors[
              `consumo_minimo_${index}`
            ] =
              `Debe comenzar en ${esperado}`;
          }
        }
      }
    },
  );

  /**
   * ==========================================================
   * PASO 4
   * SI EXISTEN ERRORES RELACIONALES
   * ==========================================================
   */
  if (
    Object.keys(
      errors,
    ).length > 0
  ) {
    return {
      isValid: false,

      errors,

      data: null,
    };
  }

  /**
   * ==========================================================
   * PASO 5
   * TODO CORRECTO
   * ==========================================================
   */
  return {
    isValid: true,

    errors: {},

    data,
  };
};

/**
 * ============================================================
 * VALIDAR PARAMS
 * ============================================================
 *
 * Se usa en TarifasPage.
 */
export const validateTarifaParams = (
  data,
) => {
  const result =
    tarifaParamsSchema.safeParse(
      data,
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
      formatZodErrors(
        result.error,
      ),

    data: null,
  };
};

/**
 * ============================================================
 * VALIDAR ID
 * ============================================================
 *
 * Se usa antes de:
 *
 * GET /tarifa/:id
 *
 * PATCH /tarifa/:id
 *
 * cambiar estado
 */
export const validateTarifaId = (
  id,
) => {
  const result =
    tarifaIdSchema.safeParse(
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