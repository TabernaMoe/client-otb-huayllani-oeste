import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '../services/error';

/**
 * Hook reutilizable para ejecutar mutaciones (POST/PATCH/PUT/DELETE)
 * con estado de carga, toast de éxito y manejo unificado de errores detallados.
 */
export function useAsyncSubmit() {
  const [submitting, setSubmitting] = useState(false);

  const run = useCallback(
    async (
      action,
      {
        successMessage,
        errorMessage = 'No se pudo completar la operación',
        onSuccess,
      } = {},
    ) => {
      try {
        setSubmitting(true);
        const response = await action();

        if (response?.ok === false) {
          toast.error(getApiErrorMessage(response, errorMessage));
          return { ok: false, response };
        }

        const resolvedSuccess =
          typeof successMessage === 'function'
            ? successMessage(response)
            : successMessage;

        if (resolvedSuccess) {
          toast.success(resolvedSuccess);
        }

        await onSuccess?.(response);
        return { ok: true, response };
      } catch (error) {
        toast.error(getApiErrorMessage(error, errorMessage));
        return { ok: false, error };
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { submitting, run };
}
