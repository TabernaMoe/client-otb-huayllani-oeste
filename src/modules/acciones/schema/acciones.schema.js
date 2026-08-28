import { z } from 'zod';

/**
 * ============================================================
 * SCHEMA PRINCIPAL DE ACCIÓN
 * ============================================================
 *
 * Este schema representa los datos que necesita
 * el backend para crear o actualizar una acción.
 *
 * Payload esperado:
 *
 * {
 *   socio_id: 1,
 *   calle_id: 1,
 *   tarifa_id: 1,
 *   nro_medidor: "321",
 *   direccion: "Peru casi uyuni",
 *   observacion: "Sin observación",
 *   estado: "ACTIVO",
 *   detallesAccion: [2]
 * }
 */
export const accionSchema = z.object({
  /**
   * ==========================================================
   * SOCIO
   * ==========================================================
   *
   * z.coerce.number()
   *
   * permite convertir:
   *
   * "1" → 1
   *
   * Esto es útil porque los <select>
   * normalmente devuelven strings.
   */
  socio_id: z.coerce
    .number()
    .int(
      'Debe seleccionar un socio válido',
    )
    .positive(
      'Debe seleccionar un socio',
    ),

  /**
   * ==========================================================
   * CALLE
   * ==========================================================
   */
  calle_id: z.coerce
    .number()
    .int(
      'Debe seleccionar una calle válida',
    )
    .positive(
      'Debe seleccionar una calle',
    ),

  /**
   * ==========================================================
   * TARIFA
   * ==========================================================
   */
  tarifa_id: z.coerce
    .number()
    .int(
      'Debe seleccionar una tarifa válida',
    )
    .positive(
      'Debe seleccionar una tarifa',
    ),

  /**
   * ==========================================================
   * NÚMERO DE MEDIDOR
   * ==========================================================
   */
  nro_medidor: z
    .string()
    .trim()
    .min(
      1,
      'El número de medidor es obligatorio',
    )
    .max(
      50,
      'El número de medidor es muy largo',
    ),

  /**
   * ==========================================================
   * DIRECCIÓN
   * ==========================================================
   */
  direccion: z
    .string()
    .trim()
    .min(
      1,
      'La dirección es obligatoria',
    )
    .max(
      255,
      'La dirección es muy larga',
    ),

  /**
   * ==========================================================
   * OBSERVACIÓN
   * ==========================================================
   *
   * Puede venir:
   *
   * ""
   *
   * o también puede ser undefined.
   */
  observacion: z
    .string()
    .trim()
    .max(
      500,
      'La observación es muy larga',
    )
    .optional()
    .or(
      z.literal(''),
    ),

  /**
   * ==========================================================
   * ESTADO
   * ==========================================================
   *
   * Solamente permitimos estos valores.
   */
  estado: z.enum(
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

  /**
   * ==========================================================
   * DETALLES DE ACCIÓN
   * ==========================================================
   *
   * Ejemplo:
   *
   * detallesAccion: [2, 3]
   *
   * Cada elemento debe ser un ID numérico positivo.
   */
  detallesAccion: z
    .array(
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
 * SCHEMA PARA PARÁMETROS DEL LISTADO
 * ============================================================
 *
 * Lo utilizaremos en AccionesPage.
 *
 * Ejemplo:
 *
 * {
 *   page: 1,
 *   limit: 10,
 *   search: '',
 *   estado: 'ACTIVO'
 * }
 */
export const accionParamsSchema = z.object({
  /**
   * Página.
   */
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

  /**
   * Cantidad de registros.
   */
  limit: z.coerce
    .number()
    .int(
      'El límite debe ser un número entero',
    )
    .min(
      1,
      'El límite debe ser mínimo 1',
    )
    .max(
      100,
      'El límite máximo es 100',
    )
    .default(10),

  /**
   * Búsqueda.
   */
  search: z
    .string()
    .trim()
    .default(''),

  /**
   * Estado utilizado como filtro.
   *
   * Lo hacemos opcional por si después
   * quieres tener la opción "Todos".
   */
  estado: z
    .enum([
      'ACTIVO',
      'PASIVO',
      'ANULADO',
    ])
    .optional(),
});

/**
 * ============================================================
 * SCHEMA DEL ID
 * ============================================================
 *
 * Se utiliza para:
 *
 * GET /accion/:id
 *
 * PATCH /accion/:id
 *
 * cambiar estado
 */
export const accionIdSchema = z.coerce
  .number()
  .int(
    'El identificador debe ser un número entero',
  )
  .positive(
    'El identificador de la acción no es válido',
  );

/**
 * ============================================================
 * SCHEMA PARA CAMBIAR ESTADO
 * ============================================================
 *
 * Payload:
 *
 * {
 *   estado: "ACTIVO"
 * }
 */
export const accionEstadoSchema = z.object({
  estado: z.enum(
    [
      'ACTIVO',
      'PASIVO',
      'ANULADO',
    ],
    {
      message:
        'El estado seleccionado no es válido',
    },
  ),
});

/**
 * ============================================================
 * FUNCIÓN INTERNA PARA CONVERTIR ERRORES
 * ============================================================
 *
 * Esta función NO necesitamos importarla
 * desde los componentes.
 *
 * Convierte:
 *
 * ZodError
 *
 * en:
 *
 * {
 *   socio_id: 'Debe seleccionar un socio',
 *   tarifa_id: 'Debe seleccionar una tarifa'
 * }
 *
 * Esto hace que podamos utilizar:
 *
 * errors.socio_id
 * errors.tarifa_id
 */
const formatErrors = (
  zodError,
) => {
  const errors = {};

  const issues =
    zodError?.issues || [];

  issues.forEach(
    (issue) => {
      /**
       * Ejemplo:
       *
       * issue.path
       *
       * ['socio_id']
       */
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
 *
 * Esta es la función principal
 * que importaremos desde AccionModal.jsx.
 *
 * El JSX ya NO utilizará:
 *
 * accionSchema.safeParse()
 *
 * directamente.
 */
export const validateAccion = (
  data,
) => {
  /**
   * Normalizamos el estado.
   *
   * Ejemplo:
   *
   * "activo"
   *
   * se convierte en:
   *
   * "ACTIVO"
   */
  const normalizedData = {
    ...data,

    estado: String(
      data?.estado ||
        'ACTIVO',
    )
      .trim()
      .toUpperCase(),
  };

  /**
   * Validamos con Zod.
   */
  const result =
    accionSchema.safeParse(
      normalizedData,
    );

  /**
   * ==========================================================
   * CORRECTO
   * ==========================================================
   */
  if (
    result.success
  ) {
    return {
      isValid: true,

      errors: {},

      /**
       * result.data contiene
       * los datos ya validados.
       *
       * Además z.coerce habrá convertido
       * los IDs a números.
       */
      data:
        result.data,
    };
  }

  /**
   * ==========================================================
   * INCORRECTO
   * ==========================================================
   */
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
 * VALIDAR PARÁMETROS DEL LISTADO
 * ============================================================
 *
 * Esta función la importaremos
 * desde AccionesPage.jsx.
 */
export const validateAccionParams = (
  data,
) => {
  const normalizedData = {
    ...data,

    /**
     * Si existe estado lo normalizamos.
     */
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
 *
 * Lo podemos utilizar antes de hacer:
 *
 * GET
 * PATCH
 * cambiar estado
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
 * VALIDAR CAMBIO DE ESTADO
 * ============================================================
 */
export const validateAccionEstado = (
  data,
) => {
  const normalizedData = {
    estado: String(
      data?.estado || '',
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