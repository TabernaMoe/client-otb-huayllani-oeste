import { z } from 'zod';

/**
 * ============================================================
 * EXPRESIONES REGULARES
 * ============================================================
 */

/**
 * Permite:
 *
 * - letras mayúsculas
 * - letras minúsculas
 * - letras con tilde
 * - ñ
 * - espacios
 */
const textoSoloLetras =
  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;


/**
 * ============================================================
 * SCHEMA PARA CREAR SOCIO
 * ============================================================
 *
 * Este schema valida todos los campos necesarios
 * para registrar un nuevo socio.
 */
export const socioSchema = z.object({

  /**
   * CI
   */
  ci_socio: z
    .string()
    .trim()
    .min(
      5,
      'El CI debe tener mínimo 5 dígitos',
    )
    .max(
      12,
      'El CI debe tener máximo 12 dígitos',
    )
    .regex(
      /^\d+$/,
      'El CI solo debe contener números',
    ),

  /**
   * Departamento de expedición.
   */
  ci_expedido: z
    .string()
    .trim()
    .min(
      1,
      'Debe seleccionar el expedido',
    ),

  /**
   * Nombres.
   */
  nombres: z
    .string()
    .trim()
    .min(
      2,
      'El nombre debe tener mínimo 2 caracteres',
    )
    .max(
      100,
      'El nombre debe tener máximo 100 caracteres',
    )
    .regex(
      textoSoloLetras,
      'El nombre solo debe contener letras',
    ),

  /**
   * Primer apellido.
   */
  primer_apellido: z
    .string()
    .trim()
    .min(
      2,
      'El primer apellido debe tener mínimo 2 caracteres',
    )
    .max(
      100,
      'El primer apellido debe tener máximo 100 caracteres',
    )
    .regex(
      textoSoloLetras,
      'El primer apellido solo debe contener letras',
    ),

  /**
   * Segundo apellido.
   *
   * Permitimos que esté vacío.
   */
  segundo_apellido: z
    .string()
    .trim()
    .max(
      100,
      'El segundo apellido debe tener máximo 100 caracteres',
    )
    .refine(
      (value) =>
        value === '' ||
        textoSoloLetras.test(value),
      {
        message:
          'El segundo apellido solo debe contener letras',
      },
    )
    .optional()
    .or(z.literal('')),

  /**
   * Número de celular.
   *
   * En Bolivia normalmente utilizamos 8 dígitos.
   */
  numero_celular: z
    .string()
    .trim()
    .length(
      8,
      'El celular debe tener exactamente 8 dígitos',
    )
    .regex(
      /^\d+$/,
      'El celular solo debe contener números',
    ),

  /**
   * Género.
   *
   * Solo aceptamos estos dos valores.
   */
  genero: z.enum(
    [
      'MASCULINO',
      'FEMENINO',
    ],
    {
      message:
        'Debe seleccionar el género',
    },
  ),

  /**
   * Dirección.
   */
  direccion: z
    .string()
    .trim()
    .min(
      5,
      'La dirección debe tener mínimo 5 caracteres',
    )
    .max(
      255,
      'La dirección debe tener máximo 255 caracteres',
    ),
});


/**
 * ============================================================
 * SCHEMA PARA ACTUALIZAR SOCIO
 * ============================================================
 *
 * partial() convierte todos los campos
 * del schema en opcionales.
 *
 * Esto funciona correctamente para PATCH.
 *
 * Ejemplo:
 *
 * {
 *   numero_celular: '77777777'
 * }
 *
 * No obliga a enviar todos los demás campos.
 */
export const updateSocioSchema =
  socioSchema.partial();


/**
 * ============================================================
 * SCHEMA PARA PARAMETROS DEL GET
 * ============================================================
 *
 * Ejemplo:
 *
 * {
 *   page: 1,
 *   limit: 5,
 *   search: 'Juan',
 *   estado: true
 * }
 */
export const socioParamsSchema = z.object({

  /**
   * Página actual.
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
   * Cantidad de elementos por página.
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
    .default(5),

  /**
   * Búsqueda.
   */
  search: z
    .string()
    .trim()
    .default(''),

  /**
   * Estado.
   *
   * Puede ser:
   *
   * true
   * false
   * undefined
   */
  estado: z
    .boolean()
    .optional(),
});


/**
 * ============================================================
 * SCHEMA DEL ID
 * ============================================================
 */
export const socioIdSchema = z.coerce
  .number()
  .int(
    'El ID debe ser un número entero',
  )
  .positive(
    'El identificador del socio no es válido',
  );


/**
 * ============================================================
 * FUNCIÓN INTERNA PARA FORMATEAR ERRORES
 * ============================================================
 *
 * Esta función no necesitamos importarla
 * en los componentes.
 *
 * Convierte los errores de Zod a:
 *
 * {
 *   nombres: [
 *      'El nombre debe tener mínimo 2 caracteres'
 *   ]
 * }
 */
const formatFieldErrors = (
  zodError,
) => {
  return zodError.flatten()
    .fieldErrors;
};


/**
 * ============================================================
 * VALIDAR CREACIÓN DE SOCIO
 * ============================================================
 *
 * Esta es la función que utilizaremos directamente
 * desde SocioModal.jsx.
 *
 * Devuelve:
 *
 * CORRECTO:
 *
 * {
 *   success: true,
 *   data: {...},
 *   errors: {}
 * }
 *
 *
 * INCORRECTO:
 *
 * {
 *   success: false,
 *   data: null,
 *   errors: {...}
 * }
 */
export const validateSocio = (
  data,
) => {

  const result =
    socioSchema.safeParse(
      data,
    );

  if (!result.success) {

    return {
      success: false,

      data: null,

      errors:
        formatFieldErrors(
          result.error,
        ),
    };
  }

  return {
    success: true,

    data: result.data,

    errors: {},
  };
};


/**
 * ============================================================
 * VALIDAR ACTUALIZACIÓN
 * ============================================================
 *
 * Esta función utiliza updateSocioSchema.
 *
 * Como el schema tiene partial(),
 * podemos enviar solamente campos modificados.
 */
export const validateUpdateSocio = (
  data,
) => {

  const result =
    updateSocioSchema.safeParse(
      data,
    );

  if (!result.success) {

    return {
      success: false,

      data: null,

      errors:
        formatFieldErrors(
          result.error,
        ),
    };
  }

  return {
    success: true,

    data: result.data,

    errors: {},
  };
};


/**
 * ============================================================
 * VALIDAR PARÁMETROS DEL LISTADO
 * ============================================================
 *
 * Se utiliza en SocioPage.jsx.
 */
export const validateSocioParams = (
  data,
) => {

  const result =
    socioParamsSchema.safeParse(
      data,
    );

  if (!result.success) {

    return {
      success: false,

      data: null,

      errors:
        formatFieldErrors(
          result.error,
        ),
    };
  }

  return {
    success: true,

    data: result.data,

    errors: {},
  };
};


/**
 * ============================================================
 * VALIDAR ID
 * ============================================================
 *
 * Se puede utilizar antes de editar,
 * cambiar estado, obtener un registro, etc.
 */
export const validateSocioId = (
  id,
) => {

  const result =
    socioIdSchema.safeParse(
      id,
    );

  if (!result.success) {

    return {
      success: false,

      data: null,

      error:
        result.error.issues?.[0]
          ?.message ||
        'ID inválido',
    };
  }

  return {
    success: true,

    data: result.data,

    error: null,
  };
};