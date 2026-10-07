import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class LecturasServices {
  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/lectura', { params });
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(accionId) {
    try {
      const { data } = await api.get(`/admin/lectura/${accionId}`);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
  static async getHistorial({ accion_id }) {
    try {
      const response = await api.get(`/admin/lectura/historial/${accion_id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }

  static async getAcionesWithMora() {
    try {
      const response = await api.get('/admin/lectura/acciones-con-mora');
      return response.data;
    } catch (e) {
      toServiceError(e);
    }
  }

  static async create(accionId, payload) {
    try {
      const { data } = await api.post(`/admin/lectura/${accionId}`, payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(accionId, payload) {
    try {
      const { data } = await api.patch(`/admin/lectura/${accionId}`, payload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async updateMora({ id, payload }) {
    try {
      const response = await api.patch(
        `/admin/lectura/modificar-mora/${id}`,
        payload,
      );
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async updateM3({ id, payload }) {
    try {
      const response = await api.patch(
        `/admin/lectura/modificar-m3/${id}`,
        payload,
      );
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async cambioMedidor(accionId, payload) {
    try {
      const { data } = await api.patch(
        `/admin/lectura/cambio/${accionId}`,
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
