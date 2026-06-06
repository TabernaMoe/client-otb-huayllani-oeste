export const validateRoleForm = (form) => {
  const errors = {};

  if (!form.nombre_rol?.trim()) {
    errors.nombre_rol = 'El nombre del rol es obligatorio';
  }

  if (!Array.isArray(form.permisos) || form.permisos.length === 0) {
    errors.permisos = 'Debe seleccionar al menos un permiso';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};