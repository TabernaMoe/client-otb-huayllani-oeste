/**
 * ============================================================
 * FORMATEAR DINERO
 * ============================================================
 */
export const formatMoney = (
  value,
) =>
  new Intl.NumberFormat(
    'es-BO',
    {
      style:
        'currency',

      currency:
        'BOB',
    },
  ).format(
    Number(
      value || 0,
    ),
  );


/**
 * ============================================================
 * ID SOCIO
 * ============================================================
 */
export const getSocioId = (
  socio,
) => {

  const id =
    socio?.socio_id ??
    socio?.id_socio ??
    socio?.socio?.id ??
    socio?.id;


  return id
    ? Number(
        id,
      )
    : 0;
};


/**
 * ============================================================
 * NOMBRE SOCIO
 * ============================================================
 */
export const getSocioName = (
  socio,
) => {

  return (
    socio?.nombre_completo ||
    [
      socio?.nombres,
      socio?.primer_apellido,
      socio?.segundo_apellido,
    ]
      .filter(
        Boolean,
      )
      .join(' ') ||
    'Sin nombre'
  );
};


/**
 * ============================================================
 * INICIALES
 * ============================================================
 */
export const getSocioInitials = (
  socio,
) => {

  return getSocioName(
    socio,
  )
    .split(' ')
    .filter(
      Boolean,
    )
    .slice(
      0,
      2,
    )
    .map(
      (item) =>
        item
          .charAt(0)
          .toUpperCase(),
    )
    .join('');
};


/**
 * ============================================================
 * CI SOCIO
 * ============================================================
 */
export const getSocioCi = (
  socio,
) => {

  return (
    socio?.ci_socio ||
    socio?.ci ||
    socio?.cedula_identidad ||
    '-'
  );
};


/**
 * ============================================================
 * ID COBRO
 * ============================================================
 */
export const getCobroId = (
  cobro,
) => {

  const id =
    cobro?.cobro_id ??
    cobro?.detalle_pago_accion_id ??
    cobro?.detalle_id ??
    cobro?.id;


  return id
    ? Number(
        id,
      )
    : 0;
};


/**
 * ============================================================
 * SALDO
 * ============================================================
 */
export const getCobroSaldo = (
  cobro,
) => {

  return Number(
    cobro?.saldo ??
    cobro?.saldo_pendiente ??
    cobro?.monto_pendiente ??
    0,
  );
};


/**
 * ============================================================
 * CÓDIGO ACCIÓN
 * ============================================================
 */
export const getCodigoAccion = (
  cobro,
) => {

  const codigo =
    cobro?.codigo_accion ??
    cobro?.codigo_interno ??
    cobro?.accion_codigo ??
    cobro?.accion_id;


  if (
    codigo !== undefined &&
    codigo !== null &&
    codigo !== ''
  ) {

    return String(
      codigo,
    );
  }


  const texto =
    String(
      cobro?.descripcion ||
      '',
    );


  const match =
    texto.match(
      /c[oó]digo\s+(\d+)/i,
    );


  return (
    match?.[1] ||
    'Sin código'
  );
};


/**
 * ============================================================
 * AGRUPAR COBROS POR ACCIÓN
 * ============================================================
 */
export const groupCobrosByAccion = (
  cobros = [],
) => {

  const groups = {};


  cobros.forEach(
    (cobro) => {

      const codigo =
        getCodigoAccion(
          cobro,
        );


      if (
        !groups[codigo]
      ) {

        groups[codigo] = {

          codigo,

          titulo:
            codigo ===
            'Sin código'

              ? 'Acción sin código'

              : `Acción código ${codigo}`,

          cobros:
            [],

          total:
            0,
        };
      }


      groups[
        codigo
      ].cobros.push(
        cobro,
      );


      groups[
        codigo
      ].total +=
        getCobroSaldo(
          cobro,
        );
    },
  );


  return Object.values(
    groups,
  );
};


/**
 * ============================================================
 * IMAGEN QR
 * ============================================================
 */
export const getQrImageSrc = (
  qrImage,
) => {

  if (
    !qrImage
  ) {

    return '';
  }


  if (
    qrImage.startsWith(
      'data:image',
    )
  ) {

    return qrImage;
  }


  return `data:image/png;base64,${qrImage}`;
};