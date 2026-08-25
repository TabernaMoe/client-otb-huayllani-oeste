import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class RolesServices {
  static async getAll(params = {}) {
    try {
      const response = await api.get('/admin/auth/roles/pagination', 
        {params,}
      );

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getForSelect() {
    try {
      const response = await api.get('/admin/auth/roles');
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getPermissions() {
    try {
      const response = await api.get('/admin/auth/roles/permisos');
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const response = await api.get(`/admin/auth/roles/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      
      const response = await api.post('/admin/auth/roles', payload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      
      const response = await api.patch(`/admin/auth/roles/${id}`, payload);
      return response.data;
    } catch (error) {

      return toServiceError(error);
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/admin/auth/roles/${id}`);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}