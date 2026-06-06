export const validateTarifaForm = (form) => {
  const errors = {};

  if (!form.nombre_tarifa?.trim()) {
    errors.nombre_tarifa = 'El nombre de la tarifa es obligatorio';
  }

  if (!Array.isArray(form.rangosTarifa) || form.rangosTarifa.length === 0) {
    errors.rangosTarifa = 'Debe agregar al menos un rango';
  }

  form.rangosTarifa.forEach((rango, index) => {
    const consumoMinimo = Number(rango.consumo_minimo);
    const consumoMaximo = Number(rango.consumo_maximo);
    const precio = Number(rango.precio);

    if (rango.consumo_minimo === '') {
      errors[`consumo_minimo_${index}`] = 'Obligatorio';
    } else if (Number.isNaN(consumoMinimo) || consumoMinimo < 0) {
      errors[`consumo_minimo_${index}`] = 'Debe ser mayor o igual a 0';
    }

    if (rango.consumo_maximo === '') {
      errors[`consumo_maximo_${index}`] = 'Obligatorio';
    } else if (Number.isNaN(consumoMaximo) || consumoMaximo < 0) {
      errors[`consumo_maximo_${index}`] = 'Debe ser mayor o igual a 0';
    }

    if (
      rango.consumo_minimo !== '' &&
      rango.consumo_maximo !== '' &&
      consumoMaximo <= consumoMinimo
    ) {
      errors[`consumo_maximo_${index}`] =
        'Debe ser mayor al consumo mínimo';
    }

    if (rango.precio === '') {
      errors[`precio_${index}`] = 'Obligatorio';
    } else if (Number.isNaN(precio) || precio <= 0) {
      errors[`precio_${index}`] = 'Debe ser mayor a 0';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};