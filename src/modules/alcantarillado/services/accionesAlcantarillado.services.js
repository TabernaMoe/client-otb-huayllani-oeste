import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AlcantarilladoServices {
  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/acciones/alcantarillado', {
        params,
      });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getId({ id }) {
    try {
      const { data } = await api.get(`/admin/acciones/alcantarillado/${id}`);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getSocios() {
    try {
      const { data } = await api.get('/admin/acciones/alcantarillado/socio');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getCalles() {
    try {
      const { data } = await api.get('/admin/acciones/alcantarillado/calle');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getDetalle() {
    try {
      const { data } = await api.get(
        '/admin/acciones/alcantarillado/detalles-accion',
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create({ payload }) {
    try {
      const { data } = await api.post(
        '/admin/acciones/alcantarillado',
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update({ id, payload }) {
    try {
      const { data } = await api.patch(
        `/admin/acciones/alcantarillado/${id}`,
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async changeEstado({ id }) {
    try {
      const { data } = await api.patch(
        `/admin/acciones/alcantarillado/change-status/${id}`,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
