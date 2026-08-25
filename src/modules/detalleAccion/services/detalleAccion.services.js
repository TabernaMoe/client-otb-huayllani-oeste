import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class DetalleAccionServices {
 
  static async getAll(params = {}) {
    try {
      const { data } = await api.get(
        '/admin/accion/detalle',
        {
          params,
        },
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }


  static async getTiposAccion() {
    try {
      const { data } = await api.get(
        '/admin/accion/detalle/tipos-accion',
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const { data } = await api.get(
        `/admin/accion/detalle/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

 
  static async create(payload) {
    try {
      

      const { data } = await api.post(
        '/admin/accion/detalle',
        payload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(
    id,
    payload,
  ) {
    try {
     

      const { data } = await api.patch(
        `/admin/accion/detalle/${id}`,
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
        `/admin/accion/detalle/cambiar-estado/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}