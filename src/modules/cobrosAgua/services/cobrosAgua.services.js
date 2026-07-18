import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

/**
 * Intenta extraer el nombre del archivo enviado por el backend.
 *
 * Ejemplo de header:
 * content-disposition: attachment; filename="recibo-00001.pdf"
 */
const getFilenameFromHeaders = (headers = {}) => {
  const disposition =
    headers['content-disposition'] || headers['Content-Disposition'];

  if (!disposition) {
    return `recibo-agua-${Date.now()}.pdf`;
  }

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].replace(/["']/g, ''));
  }

  const normalMatch = disposition.match(/filename="?([^";]+)"?/i);

  return normalMatch?.[1] || `recibo-agua-${Date.now()}.pdf`;
};

/**
 * Como el endpoint de pago puede devolver:
 * - directamente un PDF;
 * - un JSON convertido en Blob;
 * analizamos el content-type antes de retornar el resultado.
 */
const normalizePaymentResponse = async (response) => {
  const contentType =
    response.headers?.['content-type'] ||
    response.data?.type ||
    '';

  const isJson =
    contentType.includes('application/json') ||
    contentType.includes('text/json');

  if (response.data instanceof Blob && isJson) {
    const text = await response.data.text();
    const json = JSON.parse(text);

    return json;
  }

  if (response.data instanceof Blob) {
    return {
      ok: true,
      message: 'Pago registrado correctamente',
      pdfBlob: response.data,
      filename: getFilenameFromHeaders(response.headers),
    };
  }

  return response.data;
};

/**
 * Permite recuperar el mensaje del backend cuando Axios recibe
 * un error en formato Blob por haber usado responseType: 'blob'.
 */
const normalizeBlobError = async (error) => {
  const errorBlob = error?.response?.data;

  if (errorBlob instanceof Blob) {
    try {
      const text = await errorBlob.text();
      const parsed = JSON.parse(text);

      return {
        ok: false,
        message:
          parsed?.message ||
          parsed?.error ||
          'No se pudo registrar el pago de agua',
        errors: parsed?.errors || null,
        status: error?.response?.status,
      };
    } catch {
      return {
        ok: false,
        message: 'No se pudo registrar el pago de agua',
        status: error?.response?.status,
      };
    }
  }

  return toServiceError(error);
};

export class CobrosAguaServices {
  /**
   * Lista de acciones con cobros de agua.
   *
   * GET /admin/pago-agua
   */
  static async getAll(page = 1, limit = 10, search = '') {
    try {
      const { data } = await api.get('/admin/pago-agua', {
        params: {
          page,
          limit,
          search,
        },
      });

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * Obtiene una acción específica con sus cobros pendientes o parciales.
   *
   * GET /admin/pago-agua/:accionId
   */
  static async getByAccionId(accionId) {
    try {
      const { data } = await api.get(`/admin/pago-agua/${accionId}`);

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * Obtiene el historial de cobros de agua de una acción.
   *
   * GET /admin/pago-agua/historial/:accionId
   */
  static async getHistorial(accionId) {
    try {
      const { data } = await api.get(
        `/admin/pago-agua/historial/${accionId}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  /**
   * Registra el pago de una lectura.
   *
   * PATCH /admin/pago-agua/pagar/:accionId
   *
   * El backend puede devolver directamente el PDF del recibo.
   */
  static async pagar(accionId, payload) {
    try {
      const cleanPayload = {
        monto: Number(payload.monto),
        cobro_agua_id: Number(payload.cobro_agua_id),
        metodo_pago: String(payload.metodo_pago).trim().toUpperCase(),
      };

      const observacion = String(payload.observacion || '').trim();

      if (observacion) {
        cleanPayload.observacion = observacion;
      }

      const response = await api.patch(
        `/admin/pago-agua/pagar/${accionId}`,
        cleanPayload,
        {
          responseType: 'blob',
        },
      );

      return await normalizePaymentResponse(response);
    } catch (error) {
      return await normalizeBlobError(error);
    }
  }
}