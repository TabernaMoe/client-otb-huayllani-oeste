export const normalizeApiError = (error) => {
  const status = error?.response?.status ?? 0;
  const code = error?.code || 'UNKNOWN_ERROR';
  const payload = error?.response?.data;

  let message = 'Error inesperado';

  if (payload && typeof payload === 'object' && payload.message) {
    message = payload.message;
  } else if (typeof payload === 'string' && payload.trim()) {
    message = payload;
  } else if (code === 'ERR_NETWORK') {
    message = 'Error de red o servidor no disponible';
  } else if (error?.message) {
    message = error.message;
  }

  return {
    ok: false,
    status,
    code,
    message,
    payload,
  };
};

export const toServiceError = (error) => {
  const normalized = normalizeApiError(error);
  console.log(normalized);

  if (normalized.payload && typeof normalized.payload === 'object') {
    return {
      ok: false,
      ...normalized.payload,
      status: normalized.status,
      code: normalized.code,
      message: normalized.message,
    };
  }

  return normalized;
};
