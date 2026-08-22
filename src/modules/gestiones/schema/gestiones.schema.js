export const validateGestionForm = (form) => {
  const errors = {};

  const anio = Number(form.anio);

  if (
    form.anio === '' ||
    form.anio === null ||
    form.anio === undefined
  ) {
    errors.anio =
      'El año de gestión es obligatorio';
  } else if (Number.isNaN(anio)) {
    errors.anio =
      'El año debe ser numérico';
  } else if (!Number.isInteger(anio)) {
    errors.anio =
      'El año debe ser un número entero';
  } 

  return {
    isValid:
      Object.keys(errors).length === 0,

    errors,

    data: {
      anio,
    },
  };
};