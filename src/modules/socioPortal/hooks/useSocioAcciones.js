import { useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../../services/error';
import { SocioPortalServices } from '../services/socioPortal.services';

export function useSocioAcciones() {
  const [acciones, setAcciones] = useState([]);
  const [accionSeleccionada, setAccionSeleccionada] = useState(null);
  const [loadingAcciones, setLoadingAcciones] = useState(true);
  const [errorAcciones, setErrorAcciones] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function cargarAcciones() {
      try {
        setLoadingAcciones(true);
        setErrorAcciones('');

        const response = await SocioPortalServices.getAcciones();
        const raw = response?.data ?? response;
        const data = Array.isArray(raw) ? raw : [];

        if (cancelled) return;
        setAcciones(data);
        if (data.length > 0) {
          setAccionSeleccionada(data[0].id);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorAcciones(
            getApiErrorMessage(error, 'No se pudieron cargar las acciones'),
          );
        }
      } finally {
        if (!cancelled) setLoadingAcciones(false);
      }
    }

    cargarAcciones();
    return () => {
      cancelled = true;
    };
  }, []);

  const accionActual =
    acciones.find((accion) => accion.id === accionSeleccionada) ?? null;

  return {
    acciones,
    accionSeleccionada,
    setAccionSeleccionada,
    accionActual,
    loadingAcciones,
    errorAcciones,
  };
}
