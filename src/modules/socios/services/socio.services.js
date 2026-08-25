import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class SocioServices {

  static async getAll(params = {}) {
    try {
      const { data } = await api.get('/admin/socio',{
          params,
        });

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }


  static async getById(id) {
    try {
      const { data } = await api.get(`/admin/socio/${id}`);

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

 
  static async create(payload) {
    try {
      
      const { data } = await api.post(
        '/admin/socio',
        payload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const { data } = await api.patch(
        `/admin/socio/${id}`,
        payload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

 
  static async changeEstado(id) {
    try {
      const { data } = await api.patch(
        `/admin/socio/cambiar-estado/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}