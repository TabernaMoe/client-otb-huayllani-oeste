export const validateGestionForm = (form) => {
  const errors = {};

  const anio = Number(form.anio);

  if (!form.anio) {
    errors.anio = 'El año de gestión es obligatorio';
  } else if (Number.isNaN(anio)) {
    errors.anio = 'El año debe ser numérico';
  } else if (anio < 2000 || anio > 2100) {
    errors.anio = 'El año debe estar entre 2000 y 2100';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};