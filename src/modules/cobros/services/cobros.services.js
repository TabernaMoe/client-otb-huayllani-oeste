import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class CobrosServices {
  static async getSocios(params = {}) {
    try {
      const { data } = await api.get('/admin/cobro', { params });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getSocioCobros(socioId) {
    try {
      const { data } = await api.get(`/admin/cobro/${socioId}`);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async pagar(payload) {
    try {
      const { data } = await api.post('/admin/cobro', payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getHistorial(params = {}) {
    try {
      const { data } = await api.get('/admin/cobro/historial', { params });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getAcciones(params = {}) {
    try {
      const { data } = await api.get('/admin/cobro/acciones', { params });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getMultas(params = {}) {
    try {
      const { data } = await api.get('/admin/cobro/multas', { params });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async asignarMulta(accionId, body) {
    try {
      const { data } = await api.post(`/admin/cobro/multas/${accionId}`, body);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
