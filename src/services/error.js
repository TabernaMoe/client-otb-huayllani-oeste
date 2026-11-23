const FIELD_LABELS = {
  nombre_usuario: 'Usuario',
  contrasenia: 'Contraseña',
  contrasenia_usuario: 'Contraseña',
  contrasenia_actual: 'Contraseña actual',
  contrasenia_nueva: 'Nueva contraseña',
  confirmar: 'Confirmar contraseña',
  cedula_identidad: 'Cédula de identidad',
  ci_socio: 'CI del socio',
  ci_expedido: 'Expedido',
  cargo: 'Cargo',
  nombre: 'Nombre',
  nombres: 'Nombres',
  apellido_paterno: 'Apellido paterno',
  apellido_materno: 'Apellido materno',
  primer_apellido: 'Primer apellido',
  segundo_apellido: 'Segundo apellido',
  numero_celular: 'Número de celular',
  numero_telefono: 'Número de teléfono',
  genero: 'Género',
  direccion: 'Dirección',
  rol_id: 'Rol',
  nombre_rol: 'Nombre de rol',
  permisos: 'Permisos',
  socio_id: 'Socio',
  socio_nuevo_id: 'Nuevo socio',
  calle_id: 'Calle',
  nombre_calle: 'Nombre de calle',
  tarifa_id: 'Tarifa',
  nombre_tarifa: 'Nombre de tarifa',
  rangosTarifa: 'Rangos de tarifa',
  consumo_minimo: 'Consumo mínimo',
  consumo_maximo: 'Consumo máximo',
  accion_id: 'Acción',
  tipo_accion_id: 'Tipo de acción',
  nombre_tipo_accion: 'Tipo de acción',
  nombre_accion: 'Nombre de acción',
  precio_accion: 'Precio de acción',
  tipo_cobro: 'Tipo de cobro',
  detallesAccion: 'Detalles de acción',
  nro_medidor: 'Nro. de medidor',
  lectura_actual: 'Lectura actual',
  lectura_anterior: 'Lectura anterior',
  consumo_m3: 'Consumo (m³)',
  mora: 'Mora',
  observacion: 'Observación',
  observaciones: 'Observaciones',
  observacion_mora: 'Observación de mora',
  observacion_modificacion: 'Observación de modificación',
  concepto: 'Concepto',
  descripcion: 'Descripción',
  monto: 'Monto',
  monto_multa: 'Monto de multa',
  monto_retraso: 'Monto de retraso',
  metodo_pago: 'Método de pago',
  cobros: 'Cobros',
  cobro_agua_id: 'Cobro de agua',
  multa_id: 'Multa',
  nombre_multa: 'Nombre de multa',
  precio: 'Precio',
  titulo: 'Título',
  lugar: 'Lugar',
  fecha: 'Fecha',
  fecha_inicio: 'Fecha inicio',
  fecha_final: 'Fecha final',
  hora_inicio: 'Hora de inicio',
  asistio: 'Asistencia',
  anio: 'Año',
  nombre_producto: 'Producto',
  saldo_actual: 'Saldo actual',
  categoria_egreso_id: 'Categoría de gasto',
  nombre_gasto: 'Nombre de categoría',
  beneficiario: 'Beneficiario',
  tipo: 'Tipo',
  estado: 'Estado',
};

const humanizeField = (field = '') => {
  if (!field) return '';
  const clean = String(field).replace(/\[\d+\]/g, '').split('.').pop() || '';
  if (FIELD_LABELS[clean]) return FIELD_LABELS[clean];
  const spaced = clean
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim();
  return spaced ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : '';
};

const formatIssueLine = (field, rawMessage) => {
  const msg = String(rawMessage || '').trim();
  if (!msg) return '';
  const label = humanizeField(field);
  if (!label) return msg;

  const normalizedMsg = msg.toLowerCase();
  const normalizedLabel = label.toLowerCase();
  if (normalizedMsg.includes(normalizedLabel)) {
    return msg;
  }
  return `${label}: ${msg}`;
};

export const ensureErrorPrefix = (message) => {
  const clean = String(message || '').trim();
  if (!clean) return 'Error: Ocurrió un error inesperado';
  if (/^error\b/i.test(clean)) return clean;
  return `Error: ${clean}`;
};

export const extractValidationDetails = (payload) => {
  const fieldErrors = {};
  const details = [];

  if (!payload || typeof payload !== 'object') {
    return { fieldErrors, details };
  }

  const list =
    (Array.isArray(payload.errors) && payload.errors) ||
    (Array.isArray(payload.errores) && payload.errores) ||
    (Array.isArray(payload.details) && payload.details) ||
    (Array.isArray(payload.issues) && payload.issues) ||
    null;

  if (list) {
    for (const item of list) {
      if (typeof item === 'string' && item.trim()) {
        details.push(item.trim());
      } else if (item && typeof item === 'object') {
        const field = Array.isArray(item.path)
          ? item.path.join('.')
          : item.field || item.campo || item.param || '';
        const msg = item.message || item.msg || item.error || '';
        if (field && msg && !fieldErrors[field]) {
          fieldErrors[field] = String(msg).trim();
        }
        const formatted = formatIssueLine(field, msg);
        if (formatted) details.push(formatted);
      }
    }
  } else if (payload.errors && typeof payload.errors === 'object') {
    for (const [field, value] of Object.entries(payload.errors)) {
      const msg = Array.isArray(value) ? value[0] : value;
      if (msg) {
        fieldErrors[field] = String(msg).trim();
        const formatted = formatIssueLine(field, msg);
        if (formatted) details.push(formatted);
      }
    }
  }

  const uniqueDetails = [...new Set(details)];
  return { fieldErrors, details: uniqueDetails };
};

export const formatApiErrorPayload = (payload, fallback = 'Ocurrió un error inesperado') => {
  const { details } = extractValidationDetails(payload);

  if (details.length > 0) {
    const visible = details.slice(0, 3).join(' · ');
    const extra = details.length > 3 ? ` (+${details.length - 3} más)` : '';
    return ensureErrorPrefix(`${visible}${extra}`);
  }

  if (payload && typeof payload === 'object') {
    const directMsg = payload.message || payload.error || payload.msg;
    if (typeof directMsg === 'string' && directMsg.trim()) {
      return ensureErrorPrefix(directMsg);
    }
  }

  if (typeof payload === 'string' && payload.trim()) {
    return ensureErrorPrefix(payload);
  }

  return ensureErrorPrefix(fallback);
};

const getStatusFallback = (status, code) => {
  if (code === 'ERR_NETWORK') return 'No se pudo conectar con el servidor';
  if (code === 'ECONNABORTED') return 'Tiempo de espera agotado al conectar con el servidor';
  if (status === 400 || status === 422) return 'Los datos enviados no son válidos';
  if (status === 401) return 'Tu sesión expiró, vuelve a iniciar sesión';
  if (status === 403) return 'No tienes permisos para realizar esta acción';
  if (status === 404) return 'El recurso solicitado no existe';
  if (status === 409) return 'Conflicto con un registro existente';
  if (status >= 500) return 'Error interno del servidor';
  return 'Ocurrió un error inesperado';
};

export const normalizeApiError = (error) => {
  const status = error?.response?.status ?? 0;
  const code = error?.code || 'UNKNOWN_ERROR';
  const payload = error?.response?.data;
  const rawMessage =
    (payload && typeof payload === 'object' && payload.rawMessage) ||
    (payload && typeof payload === 'object' && payload.message) ||
    error?.message ||
    '';

  const { fieldErrors, details } = extractValidationDetails(payload);
  const fallback = getStatusFallback(status, code);

  let message;
  if (details.length > 0 || (payload && typeof payload === 'object' && (payload.message || payload.error))) {
    message = formatApiErrorPayload(payload, fallback);
  } else if (typeof payload === 'string' && payload.trim()) {
    message = ensureErrorPrefix(payload);
  } else if (code === 'ERR_NETWORK' || code === 'ECONNABORTED' || status >= 400) {
    message = ensureErrorPrefix(fallback);
  } else if (error?.message) {
    message = ensureErrorPrefix(error.message);
  } else {
    message = ensureErrorPrefix(fallback);
  }

  return {
    ok: false,
    status,
    code,
    message,
    rawMessage,
    details,
    fieldErrors,
    payload,
  };
};

export const toServiceError = (error) => {
  const normalized = error?.normalized || normalizeApiError(error);

  if (normalized.payload && typeof normalized.payload === 'object' && !(normalized.payload instanceof Blob)) {
    return {
      ok: false,
      ...normalized.payload,
      status: normalized.status,
      code: normalized.code,
      message: normalized.message,
      details: normalized.details,
      fieldErrors: normalized.fieldErrors,
    };
  }

  return normalized;
};

export const formatZodErrorMessage = (zodErrorOrFields, fallback = 'Revisa los datos ingresados') => {
  if (!zodErrorOrFields) return ensureErrorPrefix(fallback);

  if (Array.isArray(zodErrorOrFields.issues) && zodErrorOrFields.issues.length > 0) {
    const lines = zodErrorOrFields.issues
      .map((issue) => formatIssueLine(issue.path?.join('.'), issue.message))
      .filter(Boolean);
    const unique = [...new Set(lines)];
    if (unique.length > 0) {
      const visible = unique.slice(0, 3).join(' · ');
      const extra = unique.length > 3 ? ` (+${unique.length - 3} más)` : '';
      return ensureErrorPrefix(`${visible}${extra}`);
    }
  }

  if (typeof zodErrorOrFields === 'object') {
    const lines = Object.entries(zodErrorOrFields)
      .map(([field, value]) => formatIssueLine(field, Array.isArray(value) ? value[0] : value))
      .filter(Boolean);
    const unique = [...new Set(lines)];
    if (unique.length > 0) {
      const visible = unique.slice(0, 3).join(' · ');
      const extra = unique.length > 3 ? ` (+${unique.length - 3} más)` : '';
      return ensureErrorPrefix(`${visible}${extra}`);
    }
  }

  return ensureErrorPrefix(fallback);
};

export const getApiErrorMessage = (error, fallback = 'Ocurrió un error inesperado') => {
  if (!error) return ensureErrorPrefix(fallback);
  if (error.normalized?.message) return error.normalized.message;
  if (error.response) return normalizeApiError(error).message;
  if (typeof error === 'object' && (error.errors || error.errores || error.message)) {
    return formatApiErrorPayload(error, fallback);
  }
  if (typeof error === 'string' && error.trim()) return ensureErrorPrefix(error);
  return ensureErrorPrefix(fallback);
};
