// src/modules/cobrosAgua/utils/cobrosAgua.utils.js

/**
 * Normaliza la respuesta del pago.
 *
 * El backend puede devolver:
 * - PDF (blob)
 * - JSON convertido en blob
 */
export async function normalizePaymentResponse(response) {
  const contentType =
    response?.headers?.['content-type'] || '';

  const data = response?.data;

  /**
   * Si el backend devuelve un PDF
   */
  if (
    data instanceof Blob &&
    contentType.includes('application/pdf')
  ) {
    return {
      ok: true,
      type: 'pdf',
      blob: data,
      filename: getFilenameFromHeaders(response.headers),
    };
  }

  /**
   * Si Axios recibió JSON como Blob
   * porque usamos responseType: 'blob'
   */
  if (data instanceof Blob) {
    const parsedData = await parseBlobJson(data);

    return {
      ok: true,
      type: 'json',
      data: parsedData,
    };
  }

  /**
   * Fallback por si la respuesta
   * no llega como Blob.
   */
  return {
    ok: true,
    type: 'json',
    data,
  };
}

/**
 * Normaliza errores cuando la petición
 * usa responseType: 'blob'.
 *
 * Axios puede convertir incluso los errores JSON
 * del backend en un Blob.
 */
export async function normalizeBlobError(error) {
  const response = error?.response;
  const data = response?.data;

  /**
   * Si el backend devolvió el error como Blob
   */
  if (data instanceof Blob) {
    try {
      const parsedData = await parseBlobJson(data);

      const serviceError = new Error(
        parsedData?.message ||
          parsedData?.error ||
          'Error al procesar el pago',
      );

      serviceError.status =
        response?.status ?? 500;

      serviceError.data =
        parsedData ?? null;

      return serviceError;
    } catch {
      // Si no se puede interpretar el Blob,
      // seguimos con el error genérico.
    }
  }

  /**
   * Error HTTP normal
   */
  const serviceError = new Error(
    data?.message ||
      data?.error ||
      error?.message ||
      'Error al procesar el pago',
  );

  serviceError.status =
    response?.status ?? 500;

  serviceError.data =
    data ?? null;

  return serviceError;
}

/**
 * Convierte un Blob que contiene JSON
 * a un objeto JavaScript.
 */
async function parseBlobJson(blob) {
  const text = await blob.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text,
    };
  }
}

/**
 * Obtiene el nombre del archivo desde
 * Content-Disposition.
 *
 * Ejemplo:
 * attachment; filename="recibo-123.pdf"
 */
function getFilenameFromHeaders(headers = {}) {
  const contentDisposition =
    headers?.['content-disposition'];

  if (!contentDisposition) {
    return 'comprobante.pdf';
  }

  const utf8Match =
    contentDisposition.match(
      /filename\*=UTF-8''([^;]+)/i,
    );

  if (utf8Match?.[1]) {
    return decodeURIComponent(
      utf8Match[1],
    );
  }

  const normalMatch =
    contentDisposition.match(
      /filename="?([^"]+)"?/i,
    );

  return (
    normalMatch?.[1] ||
    'comprobante.pdf'
  );
}