// src/modules/socioPortal/services/socioPortal.services.js

import { api } from '../../../services/api';

function buildAccionParams(accionId) {
  return accionId
    ? { accion_id: accionId }
    : {};
}

export const SocioPortalServices = {
  async getResumen() {
    const { data } = await api.get(
      '/socio/me/resumen',
    );

    return data;
  },

  async getPerfil() {
    const { data } = await api.get(
      '/socio/me',
    );

    return data;
  },

  async getAcciones() {
    const { data } = await api.get(
      '/socio/me/acciones',
    );

    return data;
  },

  async getLecturas(accionId = null) {
    const { data } = await api.get(
      '/socio/me/lecturas',
      {
        params:
          buildAccionParams(
            accionId,
          ),
      },
    );

    return data;
  },

  async getCobros(accionId = null) {
    const { data } = await api.get(
      '/socio/me/cobros',
      {
        params:
          buildAccionParams(
            accionId,
          ),
      },
    );

    return data;
  },

  async getRecibos(accionId = null) {
    const { data } = await api.get(
      '/socio/me/recibos',
      {
        params:
          buildAccionParams(
            accionId,
          ),
      },
    );

    return data;
  },

  async cambiarPassword(payload) {
    const { data } = await api.patch(
      '/socio/me/password',
      payload,
    );

    return data;
  },
};