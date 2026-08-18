export const validateDetalleAccionForm = (form) => {
  const errors = {};
  if (!form.tipo_accion_id) {
    errors.tipo_cobro = 'Debe seleccionar uni tipo de accion';
  }
  if (!form.nombre_accion?.trim()) {
    errors.nombre_accion = 'El nombre del detalle es obligatorio';
  }

  const precio = Number(form.precio_accion);

  if (form.precio_accion === '') {
    errors.precio_accion = 'El precio es obligatorio';
  } else if (Number.isNaN(precio) || precio <= 0) {
    errors.precio_accion = 'El precio debe ser mayor a 0';
  }

  if (!form.tipo_cobro) {
    errors.tipo_cobro = 'Debe seleccionar el tipo de cobro';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
