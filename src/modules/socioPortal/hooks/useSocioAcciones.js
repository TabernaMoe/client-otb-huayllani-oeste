// src/modules/socioPortal/hooks/useSocioAcciones.js

import {
  useEffect,
  useState,
} from 'react';

import {
  SocioPortalServices,
} from '../services/socioPortal.services';

export function useSocioAcciones() {
  const [
    acciones,
    setAcciones,
  ] = useState([]);

  const [
    accionSeleccionada,
    setAccionSeleccionada,
  ] = useState(null);

  const [
    loadingAcciones,
    setLoadingAcciones,
  ] = useState(true);

  const [
    errorAcciones,
    setErrorAcciones,
  ] = useState('');

  useEffect(() => {
    async function cargarAcciones() {
      try {
        setLoadingAcciones(true);
        setErrorAcciones('');

        const response =
          await SocioPortalServices
            .getAcciones();

        const data =
          response?.data ??
          response ??
          [];

        setAcciones(data);

        if (data.length > 0) {
          setAccionSeleccionada(
            data[0].id,
          );
        }
      } catch (error) {
        setErrorAcciones(
          error.response?.data
            ?.message ||
            'No se pudieron cargar las acciones',
        );
      } finally {
        setLoadingAcciones(false);
      }
    }

    cargarAcciones();
  }, []);

  const accionActual =
    acciones.find(
      (accion) =>
        accion.id ===
        accionSeleccionada,
    ) ?? null;

  return {
    acciones,
    accionSeleccionada,
    setAccionSeleccionada,
    accionActual,
    loadingAcciones,
    errorAcciones,
  };
}