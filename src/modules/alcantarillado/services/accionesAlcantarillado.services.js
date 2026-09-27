import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AlcantarilladoServices {
  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/alcantarillado/accion', {
        params,
      });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getId({ id }) {
    try {
      const { data } = await api.get(`/admin/alcantarillado/accion/${id}`);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getSocios() {
    try {
      const { data } = await api.get('/admin/alcantarillado/accion/socio');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getCalles() {
    try {
      const { data } = await api.get('/admin/alcantarillado/accion/calle');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getDetalle() {
    try {
      const { data } = await api.get('/admin/alcantarillado/accion/detalle');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create({ payload }) {
    try {
      const { data } = await api.post('/admin/alcantarillado/accion', payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update({ id, payload }) {
    try {
      const { data } = await api.patch(
        `/admin/alcantarillado/accion/${id}`,
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
        `/admin/alcantarillado/accion/cambiar-estado/${id}`,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
