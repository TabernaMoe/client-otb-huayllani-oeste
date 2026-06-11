export const validateLoginForm = (form) => {
  const errors = {};

  if (!form.user?.trim()) {
    errors.user = 'Debe ingresar el usuario';
  }

  if (!form.password?.trim()) {
    errors.password = 'Debe ingresar la contraseña';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};