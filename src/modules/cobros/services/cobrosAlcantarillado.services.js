import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class CobrosAlcantarilladoServices {
  static async getSocios() {
    try {
      const { data } = await api.get('/admin/alcantarillado/cobros/socios');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getAcciones() {
    try {
      const { data } = await api.get('/admin/alcantarillado/cobros/acciones');
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getPendientesSocio(socioId) {
    try {
      const { data } = await api.get(
        `/admin/alcantarillado/cobros/pendientes-socio/${socioId}`,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getPendientesAccion(accionId) {
    try {
      const { data } = await api.get(
        `/admin/alcantarillado/cobros/pendientes-accion/${accionId}`,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getHistorialSocio(socioId) {
    try {
      const { data } = await api.get(
        `/admin/alcantarillado/cobros/historial-socio/${socioId}`,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getHistorialAccion(accionId) {
    try {
      const { data } = await api.get(
        `/admin/alcantarillado/cobros/historial-accion/${accionId}`,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async pagar(payload) {
    try {
      const { data } = await api.post(
        '/admin/alcantarillado/cobros/pagar',
        payload,
      );
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}
