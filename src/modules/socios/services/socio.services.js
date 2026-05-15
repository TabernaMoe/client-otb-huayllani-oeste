import { api } from '../../../services/api.js';
import { toServiceError } from '../../../services/error.js';

export class SocioServices {
  static async getAll(page, limit, search = '', estado = '') {
    try {
      const response = await api.get(`/socios`, {
        params: {
          page,
          limit,
          search,
          estado,
        },
      });
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getAllSelect(search = '') {
    try {
      const response = await api.get(`/socios/select`, {
        params: {
          search,
        },
      });
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getAllDeleteds(page, limit, search = '') {
    try {
      const response = await api.get(`/socios/deleteds`, {
        params: {
          page,
          limit,
          search,
        },
      });
      console.log(response);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async getId(id) {
    try {
      const response = await api.get(`/socios/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async create(payload) {
    try {
      const response = await api.post('/socios', payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async update(id, payload) {
    try {
      const response = await api.patch(`/socios/${id}`, payload);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async delete(id) {
    try {
      const response = await api.delete(`/socios/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async restore(id) {
    try {
      const response = await api.patch(`/socios/restore/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
  static async toggleStatus(id) {
    try {
      const response = await api.patch(`/socios/toggle-status/${id}`);
      return response.data;
    } catch (e) {
      return toServiceError(e);
    }
  }
}
