import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

/**
 * Activa los console.log solamente durante el desarrollo.
 *
 * Cuando generes la aplicación para producción con npm run build,
 * estos registros dejarán de mostrarse.
 *
 * Para mostrarlos siempre, reemplaza por:
 *
 * const DEBUG_GETS = true;
 */
const DEBUG_GETS = import.meta.env.DEV;

/**
 * Construye la URL completa que se está consultando.
 *
 * Ejemplo:
 *
 * http://localhost:3000/api/admin/pago-agua
 * ?page=1
 * &limit=10
 * &search=Jhoan
 */
const buildGetUrl = (endpoint, queryParams = {}) => {
  const baseURL = String(
    api.defaults?.baseURL || '',
  ).replace(/\/$/, '');

  const searchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null
      ) {
        searchParams.set(key, String(value));
      }
    },
  );

  const queryString = searchParams.toString();

  return `${baseURL}${endpoint}${
    queryString ? `?${queryString}` : ''
  }`;
};

/**
 * Muestra en consola toda la información enviada
 * antes de ejecutar una petición GET.
 */
const logGetRequest = ({
  name,
  endpoint,
  queryParams = {},
  pathParams = {},
}) => {
  if (!DEBUG_GETS) return;

  console.groupCollapsed(
    `🔵 GET iniciado: ${name}`,
  );

  console.log('Método HTTP:', 'GET');

  console.log('Endpoint:', endpoint);

  console.log(
    'Base URL:',
    api.defaults?.baseURL || 'Sin baseURL',
  );

  console.log(
    'URL final:',
    buildGetUrl(endpoint, queryParams),
  );

  console.log(
    'Parámetros de ruta:',
    pathParams,
  );

  console.log(
    'Parámetros de consulta:',
    queryParams,
  );

  console.log(
    'Fecha de la petición:',
    new Date().toLocaleString('es-BO'),
  );

  console.groupEnd();
};

/**
 * Muestra todo lo que devuelve el backend
 * cuando la petición GET funciona correctamente.
 */
const logGetResponse = ({
  name,
  endpoint,
  response,
}) => {
  if (!DEBUG_GETS) return;

  console.groupCollapsed(
    `🟢 GET exitoso: ${name}`,
  );

  console.log('Endpoint:', endpoint);

  console.log(
    'Estado HTTP:',
    response?.status,
  );

  console.log(
    'Texto del estado:',
    response?.statusText,
  );

  console.log(
    'Headers recibidos:',
    response?.headers,
  );

  console.log(
    'Respuesta completa de Axios:',
    response,
  );

  console.log(
    'Datos enviados por el backend:',
    response?.data,
  );

  console.groupEnd();
};

/**
 * Muestra toda la información disponible
 * cuando una petición GET falla.
 */
const logGetError = ({
  name,
  endpoint,
  error,
}) => {
  if (!DEBUG_GETS) return;

  console.groupCollapsed(
    `🔴 GET con error: ${name}`,
  );

  console.log('Endpoint:', endpoint);

  console.log(
    'Mensaje de Axios:',
    error?.message,
  );

  console.log(
    'Estado HTTP:',
    error?.response?.status,
  );

  console.log(
    'Respuesta del backend:',
    error?.response?.data,
  );

  console.log(
    'Headers del error:',
    error?.response?.headers,
  );

  console.log(
    'Configuración enviada por Axios:',
    error?.config,
  );

  console.log(
    'Error completo:',
    error,
  );

  console.groupEnd();
};

/**
 * Genera un nombre alternativo para el PDF cuando
 * el backend no envía Content-Disposition.
 */
const getDefaultFilename = () =>
  `recibo-agua-${Date.now()}.pdf`;

/**
 * Comprueba si un valor es un Blob.
 */
const isBlob = (value) =>
  typeof Blob !== 'undefined' &&
  value instanceof Blob;

/**
 * Obtiene un header de Axios.
 *
 * Axios puede representar los headers como un objeto
 * normal o como AxiosHeaders.
 */
const getHeader = (
  headers,
  headerName,
) => {
  if (!headers) return '';

  if (typeof headers.get === 'function') {
    return headers.get(headerName) || '';
  }

  return (
    headers[headerName.toLowerCase()] ||
    headers[headerName] ||
    ''
  );
};

/**
 * Intenta obtener el nombre del archivo PDF
 * desde Content-Disposition.
 *
 * Ejemplos:
 *
 * filename="recibo-00001.pdf"
 *
 * filename*=UTF-8''recibo-agua.pdf
 */
const getFilenameFromHeaders = (
  headers = {},
) => {
  const disposition = getHeader(
    headers,
    'content-disposition',
  );

  if (!disposition) {
    return getDefaultFilename();
  }

  const utf8Match = disposition.match(
    /filename\*=UTF-8''([^;]+)/i,
  );

  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(
        utf8Match[1].replace(/["']/g, ''),
      );
    } catch {
      return utf8Match[1].replace(
        /["']/g,
        '',
      );
    }
  }

  const normalMatch = disposition.match(
    /filename="?([^";]+)"?/i,
  );

  return (
    normalMatch?.[1]?.trim() ||
    getDefaultFilename()
  );
};

/**
 * Intenta convertir un Blob con contenido JSON
 * nuevamente en un objeto JavaScript.
 */
const parseJsonBlob = async (blob) => {
  if (!isBlob(blob)) {
    return null;
  }

  const text = await blob.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

/**
 * Normaliza la respuesta del endpoint de pago.
 *
 * El backend puede devolver:
 *
 * - Un PDF.
 * - Un JSON convertido en Blob.
 * - Un JSON normal.
 */
const normalizePaymentResponse = async (
  response,
) => {
  const contentType = String(
    getHeader(
      response?.headers,
      'content-type',
    ) ||
      response?.data?.type ||
      '',
  ).toLowerCase();

  const responseData = response?.data;

  const isJsonResponse =
    contentType.includes(
      'application/json',
    ) ||
    contentType.includes('text/json') ||
    contentType.includes(
      'application/problem+json',
    );

  if (
    isBlob(responseData) &&
    isJsonResponse
  ) {
    const json =
      await parseJsonBlob(responseData);

    return (
      json || {
        ok: false,
        message:
          'El servidor devolvió un JSON no válido',
      }
    );
  }

  if (isBlob(responseData)) {
    if (responseData.size === 0) {
      return {
        ok: true,
        message:
          'Pago registrado, pero el PDF está vacío',
      };
    }

    return {
      ok: true,
      message:
        'Pago de agua registrado correctamente',
      pdfBlob: responseData,
      filename: getFilenameFromHeaders(
        response?.headers,
      ),
    };
  }

  return (
    responseData || {
      ok: false,
      message:
        'El servidor no devolvió información',
    }
  );
};

/**
 * Recupera el mensaje del backend cuando Axios
 * recibe un error convertido en Blob.
 */
const normalizeBlobError = async (
  error,
) => {
  const responseData =
    error?.response?.data;

  const status =
    error?.response?.status;

  if (isBlob(responseData)) {
    const text = await responseData.text();

    if (text.trim()) {
      try {
        const parsed = JSON.parse(text);

        return {
          ok: false,
          status,
          code: parsed?.code,
          message:
            parsed?.message ||
            parsed?.error ||
            'No se pudo registrar el pago de agua',
          errors:
            parsed?.errors || null,
          payload:
            parsed?.payload || null,
        };
      } catch {
        return {
          ok: false,
          status,
          message:
            text.trim() ||
            'No se pudo registrar el pago de agua',
        };
      }
    }

    return {
      ok: false,
      status,
      message:
        'No se pudo registrar el pago de agua',
    };
  }

  return toServiceError(error);
};

/**
 * Convierte un valor en un ID entero positivo.
 */
const normalizePositiveId = (value) => {
  const id = Number(value);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return 0;
  }

  return id;
};

/**
 * Métodos de pago permitidos.
 */
const PAYMENT_METHODS = [
  'EFECTIVO',
  'QR',
  'TRANSFERENCIA',
];

export class CobrosAguaServices {
  /**
   * ========================================================
   * GET 1: LISTAR ACCIONES CON COBROS DE AGUA
   * ========================================================
   *
   * Endpoint:
   *
   * GET /admin/pago-agua
   *
   * Envía:
   *
   * page
   * limit
   * search
   */
  static async getAll(
    page = 1,
    limit = 10,
    search = '',
  ) {
    const endpoint =
      '/admin/pago-agua';

    const queryParams = {
      page: Math.max(
        1,
        Number.parseInt(page, 10) || 1,
      ),

      limit: Math.max(
        1,
        Number.parseInt(limit, 10) || 10,
      ),

      search: String(
        search || '',
      ).trim(),
    };

    /**
     * Muestra lo que se enviará antes
     * de hacer la petición.
     */
    logGetRequest({
      name: 'Listar cobros de agua',
      endpoint,
      queryParams,
    });

    try {
      const response = await api.get(
        endpoint,
        {
          params: queryParams,
        },
      );

      /**
       * Muestra todo lo que respondió
       * el backend.
       */
      logGetResponse({
        name: 'Listar cobros de agua',
        endpoint,
        response,
      });

      return response.data;
    } catch (error) {
      logGetError({
        name: 'Listar cobros de agua',
        endpoint,
        error,
      });

      return toServiceError(error);
    }
  }

  /**
   * ========================================================
   * GET 2: OBTENER UNA ACCIÓN ESPECÍFICA
   * ========================================================
   *
   * Endpoint:
   *
   * GET /admin/pago-agua/:accionId
   *
   * Ejemplo:
   *
   * GET /admin/pago-agua/3
   */
  static async getByAccionId(
    accionId,
  ) {
    const safeAccionId =
      normalizePositiveId(accionId);

    if (!safeAccionId) {
      return {
        ok: false,
        message:
          'El identificador de la acción no es válido',
      };
    }

    const endpoint =
      `/admin/pago-agua/${safeAccionId}`;

    logGetRequest({
      name:
        'Obtener acción con cobros pendientes',
      endpoint,

      /**
       * accionId se envía en la URL,
       * no como query param.
       */
      pathParams: {
        accionId: safeAccionId,
      },
    });

    try {
      const response = await api.get(
        endpoint,
      );

      logGetResponse({
        name:
          'Obtener acción con cobros pendientes',
        endpoint,
        response,
      });

      return response.data;
    } catch (error) {
      logGetError({
        name:
          'Obtener acción con cobros pendientes',
        endpoint,
        error,
      });

      return toServiceError(error);
    }
  }

  /**
   * ========================================================
   * GET 3: OBTENER EL HISTORIAL
   * ========================================================
   *
   * Endpoint:
   *
   * GET /admin/pago-agua/historial/:accionId
   *
   * Ejemplo:
   *
   * GET /admin/pago-agua/historial/3
   */
  static async getHistorial(
    accionId,
  ) {
    const safeAccionId =
      normalizePositiveId(accionId);

    if (!safeAccionId) {
      return {
        ok: false,
        message:
          'El identificador de la acción no es válido',
      };
    }

    const endpoint =
      `/admin/pago-agua/historial/${safeAccionId}`;

    logGetRequest({
      name:
        'Obtener historial de cobros de agua',
      endpoint,

      pathParams: {
        accionId: safeAccionId,
      },
    });

    try {
      const response = await api.get(
        endpoint,
      );

      logGetResponse({
        name:
          'Obtener historial de cobros de agua',
        endpoint,
        response,
      });

      return response.data;
    } catch (error) {
      logGetError({
        name:
          'Obtener historial de cobros de agua',
        endpoint,
        error,
      });

      return toServiceError(error);
    }
  }

  /**
   * ========================================================
   * PATCH: REGISTRAR EL PAGO COMPLETO
   * ========================================================
   *
   * Endpoint:
   *
   * PATCH /admin/pago-agua/pagar/:accionId
   *
   * No es GET, por eso no utiliza los logs anteriores.
   */
  static async pagar(
    accionId,
    payload,
  ) {
    try {
      const safeAccionId =
        normalizePositiveId(accionId);

      if (!safeAccionId) {
        return {
          ok: false,
          message:
            'El identificador de la acción no es válido',
        };
      }

      const monto = Number(
        payload?.monto,
      );

      if (
        !Number.isFinite(monto) ||
        monto <= 0
      ) {
        return {
          ok: false,
          message:
            'El monto debe ser mayor a cero',
        };
      }

      const cobroAguaId =
        normalizePositiveId(
          payload?.cobro_agua_id,
        );

      if (!cobroAguaId) {
        return {
          ok: false,
          message:
            'Debe seleccionar un cobro de agua válido',
        };
      }

      const metodoPago = String(
        payload?.metodo_pago || '',
      )
        .trim()
        .toUpperCase();

      if (
        !PAYMENT_METHODS.includes(
          metodoPago,
        )
      ) {
        return {
          ok: false,
          message:
            'El método de pago no es válido',
        };
      }

      const cleanPayload = {
        monto,
        cobro_agua_id: cobroAguaId,
        metodo_pago: metodoPago,
      };

      const observacion = String(
        payload?.observacion || '',
      ).trim();

      if (observacion) {
        cleanPayload.observacion =
          observacion;
      }

      const response = await api.patch(
        `/admin/pago-agua/pagar/${safeAccionId}`,
        cleanPayload,
        {
          responseType: 'blob',

          headers: {
            Accept:
              'application/pdf, application/json',
          },
        },
      );

      return normalizePaymentResponse(
        response,
      );
    } catch (error) {
      return normalizeBlobError(error);
    }
  }
}