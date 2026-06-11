import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

const normalizeRolePayload = (payload) => ({
  nombre_rol: payload.nombre_rol?.trim(),
  permisos: payload.permisos.map((id) => Number(id)),
});

export class RolesServices {
  static async getAll(page = 1, limit = 5, search = '') {
    try {
      const response = await api.get('/admin/auth/roles/pagination', {
        params: { page, limit, search },
      });

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
      const cleanPayload = normalizeRolePayload(payload);

      console.log('ENVIANDO CREATE ROL:', cleanPayload);
      console.log('TIPOS:', cleanPayload.permisos.map((id) => typeof id));

      const response = await api.post('/admin/auth/roles', cleanPayload);
      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const cleanPayload = normalizeRolePayload(payload);

      console.log('ENVIANDO UPDATE ROL:', cleanPayload);
      console.log('TIPOS:', cleanPayload.permisos.map((id) => typeof id));

      const response = await api.patch(`/admin/auth/roles/${id}`, cleanPayload);
      return response.data;
    } catch (error) {
          console.log('ERROR AXIOS =>', error?.response?.data);

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