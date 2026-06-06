export const validateUsuarioForm = (form, isEdit = false) => {
  const errors = {};

  if (!form.nombre_usuario?.trim()) {
    errors.nombre_usuario = 'El nombre de usuario es obligatorio';
  }

  if (!isEdit && !form.contrasenia_usuario?.trim()) {
    errors.contrasenia_usuario = 'La contraseña es obligatoria';
  }

  if (!form.rol_id) {
    errors.rol_id = 'Debe seleccionar un rol';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};