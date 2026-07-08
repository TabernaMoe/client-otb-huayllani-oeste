import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class LecturasServices {
  static async getAll(page = 1, limit = 10, search = '') {
    try {
      const response = await api.get('/admin/lectura', {
        params: { page, limit, search },
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const response = await api.get(`/admin/lectura/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(accionId, payload) {
    try {
      const response = await api.post(`/admin/lectura/${accionId}`, {
        lectura_actual: Number(payload.lectura_actual),
        observacion: payload.observacion?.trim() || 'Sin observaciones',
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(lecturaId, payload) {
    try {
      const response = await api.patch(`/admin/lectura/${lecturaId}`, {
        lectura_actual: Number(payload.lectura_actual),
        observacion: payload.observacion?.trim() || 'Sin observaciones',
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

static async cambioMedidor(accionId, payload) {
  try {
    const response = await api.patch(`/admin/lectura/${accionId}`, {
      lectura_actual: Number(payload.lectura_actual),
      observacion: payload.observacion?.trim() || 'Cambio de medidor',
    });

    return response.data;
  } catch (error) {
    return toServiceError(error);
  }
}
}