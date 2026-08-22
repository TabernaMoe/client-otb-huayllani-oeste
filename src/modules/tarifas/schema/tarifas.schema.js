export const validateTarifaForm = (form) => {
  const errors = {};

  /**
   * ============================================================
   * NOMBRE
   * ============================================================
   */
  const nombreTarifa = String(
    form.nombre_tarifa || '',
  ).trim();

  if (!nombreTarifa) {
    errors.nombre_tarifa =
      'El nombre de la tarifa es obligatorio';
  }

  /**
   * ============================================================
   * RANGOS
   * ============================================================
   */
  const rangos = Array.isArray(
    form.rangosTarifa,
  )
    ? form.rangosTarifa
    : [];

  if (rangos.length === 0) {
    errors.rangosTarifa =
      'Debe agregar al menos un rango';
  }

  rangos.forEach(
    (rango, index) => {
      const esUltimo =
        index === rangos.length - 1;

      const consumoMinimo = Number(
        rango.consumo_minimo,
      );

      const consumoMaximo =
        rango.consumo_maximo === '' ||
        rango.consumo_maximo === null
          ? null
          : Number(
              rango.consumo_maximo,
            );

      const precio = Number(
        rango.precio,
      );

      /**
       * ========================================================
       * CONSUMO MÍNIMO
       * ========================================================
       */
      if (
        rango.consumo_minimo === '' ||
        rango.consumo_minimo === null ||
        rango.consumo_minimo === undefined
      ) {
        errors[
          `consumo_minimo_${index}`
        ] = 'Obligatorio';
      } else if (
        Number.isNaN(consumoMinimo) ||
        consumoMinimo < 0
      ) {
        errors[
          `consumo_minimo_${index}`
        ] =
          'Debe ser mayor o igual a 0';
      }

      /**
       * ========================================================
       * CONSUMO MÁXIMO
       * ========================================================
       *
       * El último rango puede ser null.
       */
      if (!esUltimo) {
        if (
          rango.consumo_maximo === '' ||
          rango.consumo_maximo === null ||
          rango.consumo_maximo === undefined
        ) {
          errors[
            `consumo_maximo_${index}`
          ] = 'Obligatorio';
        }
      }

      /**
       * Si tiene máximo, tiene que ser válido.
       */
      if (
        consumoMaximo !== null &&
        (
          Number.isNaN(
            consumoMaximo,
          ) ||
          consumoMaximo < 0
        )
      ) {
        errors[
          `consumo_maximo_${index}`
        ] =
          'Debe ser mayor o igual a 0';
      }

      /**
       * Máximo > mínimo.
       */
      if (
        consumoMaximo !== null &&
        !Number.isNaN(
          consumoMinimo,
        ) &&
        consumoMaximo <=
          consumoMinimo
      ) {
        errors[
          `consumo_maximo_${index}`
        ] =
          'Debe ser mayor al consumo mínimo';
      }

      /**
       * ========================================================
       * PRECIO
       * ========================================================
       */
      if (
        rango.precio === '' ||
        rango.precio === null ||
        rango.precio === undefined
      ) {
        errors[
          `precio_${index}`
        ] = 'Obligatorio';
      } else if (
        Number.isNaN(precio) ||
        precio <= 0
      ) {
        errors[
          `precio_${index}`
        ] =
          'Debe ser mayor a 0';
      }

      /**
       * ========================================================
       * CONTINUIDAD DE RANGOS
       * ========================================================
       *
       * Ejemplo:
       *
       * 0 - 10
       * 11 - 20
       * 21 - 30
       * 31 - null
       */
      if (index > 0) {
        const rangoAnterior =
          rangos[index - 1];

        const maxAnterior =
          rangoAnterior
            .consumo_maximo === '' ||
          rangoAnterior
            .consumo_maximo === null
            ? null
            : Number(
                rangoAnterior
                  .consumo_maximo,
              );

        if (
          maxAnterior !== null &&
          !Number.isNaN(
            maxAnterior,
          ) &&
          !Number.isNaN(
            consumoMinimo,
          ) &&
          consumoMinimo !==
            maxAnterior + 1
        ) {
          errors[
            `consumo_minimo_${index}`
          ] =
            `Debe comenzar en ${
              maxAnterior + 1
            }`;
        }
      }
    },
  );

  /**
   * ============================================================
   * RESPUESTA
   * ============================================================
   */
  return {
    isValid:
      Object.keys(errors).length === 0,

    errors,

    data: {
      nombre_tarifa:
        nombreTarifa,

      rangosTarifa:
        rangos.map((rango) => ({
          consumo_minimo: Number(
            rango.consumo_minimo,
          ),

          consumo_maximo:
            rango.consumo_maximo === '' ||
            rango.consumo_maximo === null
              ? null
              : Number(
                  rango.consumo_maximo,
                ),

          precio: Number(
            rango.precio,
          ),
        })),
    },
  };
};