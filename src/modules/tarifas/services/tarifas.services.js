import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class TarifasServices {

  static async getAll(params = {}) {
    try {
      const { data } = await api.get(
        '/admin/tarifa',
        {
          params,
        },
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const { data } = await api.get(
        `/admin/tarifa/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }


  static async create(payload) {
  try {

    const { data } = await api.post(
      '/admin/tarifa',
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
        `/admin/tarifa/${id}`,
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
        `/admin/tarifa/cambiar-estado/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}