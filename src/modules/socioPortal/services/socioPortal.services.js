import { api } from '../../../services/api';

export const SocioPortalServices = {
  async getResumen() {
    const { data } = await api.get('/socio/me/resumen');
    return data;
  },

  async getPerfil() {
    const { data } = await api.get('/socio/me');
    return data;
  },

  async getAcciones() {
    const { data } = await api.get('/socio/me/acciones');
    return data;
  },

  async getLecturas() {
    const { data } = await api.get('/socio/me/lecturas');
    return data;
  },

  async getCobros() {
    const { data } = await api.get('/socio/me/cobros');
    return data;
  },

  async getRecibos() {
    const { data } = await api.get('/socio/me/recibos');
    return data;
  },

  async cambiarPassword(payload) {
    const { data } = await api.patch('/socio/me/password', payload);
    return data;
  },
};
