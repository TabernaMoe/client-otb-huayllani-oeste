import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class ReciboServices {
  static async getAll() {
    try {
      const response = await api.get('/admin/cobros-generales/recibos');
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getSocios() {
    try {
      const response = await api.get(
        '/admin/cobros-generales/recibos/seleccion-socios',
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getAccion({ payload }) {
    try {
      const response = await api.post(
        '/admin/cobros-generales/recibos/seleccion-accion',
        payload,
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getRecibosBySocio({ id }) {
    try {
      const response = await api.get(
        `/admin/cobros-generales/recibos/socio/${id}`,
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getRecibosByAccion({ id }) {
    try {
      const response = await api.get(
        `/admin/cobros-generales/recibos/accion/${id}`,
      );
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
