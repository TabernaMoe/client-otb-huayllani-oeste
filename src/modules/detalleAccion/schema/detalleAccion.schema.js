export const validateDetalleAccionForm = (form) => {
  const errors = {};

  const tipoAccionId = Number(
    form.tipo_accion_id,
  );

  const precio = Number(
    form.precio_accion,
  );

  /**
   * TIPO DE ACCIÓN
   */
  if (!form.tipo_accion_id) {
    errors.tipo_accion_id =
      'Debe seleccionar un tipo de acción';
  } else if (
    Number.isNaN(tipoAccionId) ||
    tipoAccionId <= 0
  ) {
    errors.tipo_accion_id =
      'El tipo de acción seleccionado no es válido';
  }

  /**
   * NOMBRE
   */
  if (!form.nombre_accion?.trim()) {
    errors.nombre_accion =
      'El nombre del detalle es obligatorio';
  }

  /**
   * PRECIO
   */
  if (
    form.precio_accion === '' ||
    form.precio_accion === null ||
    form.precio_accion === undefined
  ) {
    errors.precio_accion =
      'El precio es obligatorio';
  } else if (
    Number.isNaN(precio) ||
    precio <= 0
  ) {
    errors.precio_accion =
      'El precio debe ser mayor a 0';
  }

  /**
   * TIPO DE COBRO
   */
  if (!form.tipo_cobro) {
    errors.tipo_cobro =
      'Debe seleccionar el tipo de cobro';
  }

  return {
    isValid:
      Object.keys(errors).length === 0,

    errors,

    /**
     * Payload ya limpio para enviar
     * al service.
     */
    data: {
      tipo_accion_id:
        tipoAccionId,

      nombre_accion:
        String(
          form.nombre_accion || '',
        ).trim(),

      precio_accion:
        precio,

      tipo_cobro:
        String(
          form.tipo_cobro || '',
        )
          .trim()
          .toUpperCase(),
    },
  };
};