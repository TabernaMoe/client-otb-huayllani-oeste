export const validateRoleForm = (
  form,
) => {

  

  const errors = {};


  /**
   * ==========================================
   * VALIDAR NOMBRE
   * ==========================================
   */

 

  if (
    !form.nombre_rol?.trim()
  ) {

    errors.nombre_rol =
      'El nombre del rol es obligatorio';


  } else {

    console.log(
      '✅ nombre_rol válido',
    );

  }


  /**
   * ==========================================
   * VALIDAR PERMISOS
   * ==========================================
   */



  


  if (
    !Array.isArray(
      form.permisos,
    ) ||
    form.permisos.length === 0
  ) {

    errors.permisos =
      'Debe seleccionar al menos un permiso';


    console.warn(
      '❌ permisos inválidos',
    );

  } else {

    console.log(
      '✅ permisos válidos',
    );

  }


  /**
   * ==========================================
   * RESULTADO
   * ==========================================
   */

  const result = {

    isValid:
      Object.keys(
        errors,
      ).length === 0,

    errors,

  };



  return result;
};