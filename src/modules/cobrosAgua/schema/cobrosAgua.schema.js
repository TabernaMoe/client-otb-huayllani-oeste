import { z } from 'zod';

/**
 * Métodos de pago permitidos.
 *
 * Estos valores deben coincidir exactamente con los
 * valores que acepta el backend.
 */
export const METODOS_PAGO_AGUA = [
  'EFECTIVO',
  'QR',
  'TRANSFERENCIA',
];

/**
 * Valida el formulario para pagar una deuda de agua.
 *
 * REGLA PRINCIPAL:
 *
 * En cobros de agua NO existen pagos parciales.
 * El monto pagado debe ser exactamente igual al saldo pendiente.
 */
export const pagoAguaSchema = z
  .object({
    /**
     * ID de la acción seleccionada.
     *
     * Se utiliza en la URL:
     *
     * PATCH /admin/pago-agua/pagar/:accionId
     */
    accion_id: z.coerce
      .number({
        invalid_type_error:
          'La acción seleccionada no es válida',
      })
      .int('La acción seleccionada no es válida')
      .positive('Debe seleccionar una acción')
      .finite('La acción seleccionada no es válida'),

    /**
     * ID de la deuda o lectura que será pagada.
     *
     * Se envía en el body:
     *
     * {
     *   cobro_agua_id: 1
     * }
     */
    cobro_agua_id: z.coerce
      .number({
        invalid_type_error:
          'El cobro seleccionado no es válido',
      })
      .int('El cobro seleccionado no es válido')
      .positive('Debe seleccionar una deuda de agua')
      .finite('El cobro seleccionado no es válido'),

    /**
     * Monto completo que se pagará.
     *
     * Como no existen pagos parciales, este monto
     * debe ser igual al saldo pendiente.
     */
    monto: z.coerce
      .number({
        invalid_type_error:
          'Debe ingresar un monto válido',
      })
      .finite('Debe ingresar un monto válido')
      .positive('El monto debe ser mayor a cero'),

    /**
     * Método utilizado para realizar el pago.
     */
    metodo_pago: z.enum(METODOS_PAGO_AGUA, {
      message:
        'Debe seleccionar un método de pago válido',
    }),

    /**
     * Observación opcional del pago.
     */
    observacion: z
      .string()
      .trim()
      .max(
        250,
        'La observación no puede superar los 250 caracteres',
      )
      .optional()
      .or(z.literal('')),

    /**
     * Saldo pendiente de la deuda seleccionada.
     *
     * Esta propiedad se usa solamente para validar
     * en el frontend.
     *
     * No se envía al backend.
     */
    saldo: z.coerce
      .number({
        invalid_type_error:
          'El saldo pendiente no es válido',
      })
      .finite('El saldo pendiente no es válido')
      .nonnegative(
        'El saldo pendiente no puede ser negativo',
      ),
  })
  .superRefine((data, context) => {
    /**
     * Si el saldo es cero, la deuda ya no debería
     * poder pagarse nuevamente.
     */
    if (data.saldo <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monto'],
        message:
          'El cobro seleccionado no tiene saldo pendiente',
      });

      return;
    }

    /**
     * Margen pequeño para evitar problemas con decimales.
     *
     * Ejemplo de JavaScript:
     *
     * 0.1 + 0.2 = 0.30000000000000004
     */
    const diferencia = Math.abs(
      Number(data.monto) - Number(data.saldo),
    );

    /**
     * NO SE PERMITEN PAGOS PARCIALES.
     *
     * El monto debe ser exactamente igual al saldo.
     */
    if (diferencia > 0.001) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monto'],
        message:
          'Debe pagar el saldo completo de la deuda de agua',
      });
    }
  });

/**
 * Valida el estado del formulario antes de llamar al service.
 */
export const validatePagoAgua = (form) => {
  const result = pagoAguaSchema.safeParse(form);

  if (!result.success) {
    const errors = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path?.[0];

      // Conservamos solamente el primer error de cada campo.
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    });

    return {
      isValid: false,
      errors,
      data: null,
    };
  }

  /**
   * saldo solo sirve para validar en el frontend.
   * No debe enviarse al backend.
   */
  const { saldo, ...cleanData } = result.data;

  /**
   * Si la observación está vacía, la eliminamos.
   */
  if (!cleanData.observacion) {
    delete cleanData.observacion;
  }

  return {
    isValid: true,
    errors: {},
    data: cleanData,
  };
};