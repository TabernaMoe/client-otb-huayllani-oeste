import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class GestionesServices {

  static async getAll(params = {}) {
    try {

      const { data } = await api.get(
        '/admin/gestion',
        {
          params,
        }
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const { data } = await api.get(
        `/admin/gestion/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(payload) {
    try {
      

      const { data } = await api.post(
        '/admin/gestion',
        payload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}