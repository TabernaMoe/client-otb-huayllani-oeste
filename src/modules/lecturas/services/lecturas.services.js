import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class LecturasServices {
  static async getAll() {
    try {
      const { data } = await api.get('/admin/lectura/lectura');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async create(accionId, payload) {
    try {
      const { data } = await api.post(
        `/admin/lectura/lectura/${accionId}`,
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
