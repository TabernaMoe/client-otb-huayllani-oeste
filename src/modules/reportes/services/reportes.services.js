import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

const cleanParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== null && v !== undefined && v !== 'TODOS',
    ),
  );

export class ReportesApiService {
  static async getCobros(params = {}) {
    try {
      const { data } = await api.get('/admin/reportes/cobro', {
        params: cleanParams(params),
      });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getCobrosPorFecha(payload) {
    try {
      const { data } = await api.post('/admin/reportes/cobro/fechas', payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getCobrosPorAccion(accionId, params = {}) {
    try {
      const { data } = await api.get(`/admin/reportes/cobro/accion/${accionId}`, {
        params: cleanParams(params),
      });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getCobrosPorFechaYAccion(accionId, payload) {
    try {
      const { data } = await api.post(
        `/admin/reportes/cobro/accion/fechas/${accionId}`,
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getRecibos(params = {}) {
    try {
      const { data } = await api.get('/admin/reportes/recibo', {
        params: cleanParams(params),
      });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getRecibosPorFecha(payload) {
    try {
      const { data } = await api.post('/admin/reportes/recibo/fechas', payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getRecibosPorAccion(accionId, params = {}) {
    try {
      const { data } = await api.get(`/admin/reportes/recibo/accion/${accionId}`, {
        params: cleanParams(params),
      });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getRecibosPorFechaYAccion(accionId, payload) {
    try {
      const { data } = await api.post(
        `/admin/reportes/recibo/accion/fechas/${accionId}`,
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}