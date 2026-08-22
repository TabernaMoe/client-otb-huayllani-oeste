import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class AccionesServices {

  static async getAll(page = 1, limit = 10, search = '', estado = '') {
    try {
      const params = {
        page: Math.max(1, Number.parseInt(page, 10) || 1),
        limit: Math.max(1, Number.parseInt(limit, 10) || 10),
        search: String(search || '').trim(),
      };

      if (estado) {
        params.estado = String(estado).trim().toUpperCase();
      }

      const { data } = await api.get('/admin/accion', {
        params,
      });

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getById(id) {
    try {
      const { data } = await api.get(`/admin/accion/${id}`);

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getTiposAccion() {
    try {
      const { data } = await api.get('/admin/accion/tipos-accion');

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getDetallesAccion(tipoAccionId) {
    try {
      const { data } = await api.get(
        `/admin/accion/detalle-accion/${tipoAccionId}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getSocios() {
    try {
      const { data } = await api.get('/admin/accion/socios');

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getTarifas() {
    try {
      const { data } = await api.get('/admin/accion/tarifa-agua');

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

 
  static async create(payload) {
    try {
      const cleanPayload = {
        socio_id: Number(payload.socio_id),

        calle_id: Number(payload.calle_id),

        tarifa_id: Number(payload.tarifa_id),

        nro_medidor: String(payload.nro_medidor || '').trim(),

        direccion: String(payload.direccion || '').trim(),

        observacion: String(payload.observacion || '').trim(),

        estado: String(payload.estado || 'ACTIVO')
          .trim()
          .toUpperCase(),

        detallesAccion: (payload.detallesAccion || []).map(Number),
      };

      const { data } = await api.post(
        '/admin/accion',
        cleanPayload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }


  static async update(id, payload) {
    try {
      const cleanPayload = {
        socio_id: Number(payload.socio_id),

        calle_id: Number(payload.calle_id),

        tarifa_id: Number(payload.tarifa_id),

        nro_medidor: String(payload.nro_medidor || '').trim(),

        direccion: String(payload.direccion || '').trim(),

        observacion: String(payload.observacion || '').trim(),

        estado: String(payload.estado || 'ACTIVO')
          .trim()
          .toUpperCase(),

        detallesAccion: (payload.detallesAccion || []).map(Number),
      };

      const { data } = await api.patch(
        `/admin/accion/${id}`,
        cleanPayload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }


  static async changeEstado(id, estado) {
    try {
      const cleanPayload = {
        estado: String(estado || '')
          .trim()
          .toUpperCase(),
      };

      const { data } = await api.patch(
        `/admin/accion/camibiar-estado/${id}`,
        cleanPayload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}