import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AccionesServices {
  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/acciones/agua', { params });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const { data } = await api.get(`/admin/acciones/agua/${id}`);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getTiposAccion() {
    try {
      const { data } = await api.get('/admin/acciones/agua/tipos-accion');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getDetallesAccion(tipoAccionId) {
    try {
      const { data } = await api.get(
        `/admin/acciones/agua/detalle-accion/${tipoAccionId}`,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getDetalleAccionById(id) {
    try {
      const { data } = await api.get(`/admin/acciones/agua/detalle/${id}`);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getSocios() {
    try {
      const { data } = await api.get('/admin/acciones/agua/socios');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getTarifas() {
    try {
      const { data } = await api.get('/admin/acciones/agua/tarifa');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      const { data } = await api.post('/admin/acciones/agua', payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const { data } = await api.patch(`/admin/acciones/agua/${id}`, payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getHistorialAccion(id, params = {}) {
    try {
      const { data } = await api.get(`/admin/cobro/accion-historial/${id}`, {
        params,
      });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
