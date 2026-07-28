import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

const getDataArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.rows)) return response.rows;
  if (Array.isArray(response?.payload)) return response.payload;
  return [];
};

export class AccionesServices {
  static async getAll(
  page = 1,
  limit = 10,
  search = '',
  estado = '',
) {
  try {
    const params = {
      page: Math.max(
        1,
        Number.parseInt(page, 10) || 1,
      ),

      limit: Math.max(
        1,
        Number.parseInt(limit, 10) || 10,
      ),

      search: String(search || '').trim(),
    };

    /*
     * Solo agregamos estado cuando el usuario
     * selecciona ACTIVO, PASIVO o ANULADO.
     *
     * Cuando estado es '', se solicitan todos.
     */
    if (estado) {
      params.estado = String(estado)
        .trim()
        .toUpperCase();
    }

    console.log('FILTROS ENVIADOS AL ENDPOINT:', params);

    const { data } = await api.get('/admin/accion', {
      params,
    });

    console.log('RESPUESTA DEL ENDPOINT DE ACCIONES:', data);
    console.log('ACCIONES RECIBIDAS:', data?.data);
    console.log(
      'CANTIDAD DE ACCIONES:',
      Array.isArray(data?.data)
        ? data.data.length
        : 0,
    );

    return data;
  } catch (error) {
    console.error(
      'ERROR AL OBTENER ACCIONES:',
      error?.response?.data || error,
    );

    return toServiceError(error);
  }
}

  static async getById(id) {
    try {
      const { data } = await api.get(`/admin/accion/${id}`);

      return {
        ok: data?.ok ?? true,
        message: data?.message,
        data: data?.dato || data?.data || data,
      };
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
        estado: String(payload.estado || 'ACTIVO').trim().toUpperCase(),
        detallesAccion: (payload.detallesAccion || []).map(Number),
      };

      const { data } = await api.post('/admin/accion', cleanPayload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const cleanPayload = {
        calle_id: Number(payload.calle_id),
        tarifa_id: Number(payload.tarifa_id),
        direccion: String(payload.direccion || '').trim(),
        observacion: String(payload.observacion || '').trim(),
        estado: String(payload.estado || 'ACTIVO').trim().toUpperCase(),
        detallesAccion: (payload.detallesAccion || []).map(Number),
      };

      if (payload.nro_medidor !== undefined && payload.nro_medidor !== null) {
        cleanPayload.nro_medidor = String(payload.nro_medidor || '').trim();
      }

      const { data } = await api.patch(`/admin/accion/${id}`, cleanPayload);
      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getSociosSelect(search = '') {
    try {
      const { data } = await api.get('/admin/socio/select', {
        params: { search },
      });

      return {
        ok: data?.ok ?? true,
        message: data?.message,
        data: getDataArray(data),
      };
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getCallesSelect(search = '') {
    try {
      const { data } = await api.get('/admin/calle/select', {
        params: { search },
      });

      return {
        ok: data?.ok ?? true,
        message: data?.message,
        data: getDataArray(data),
      };
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getTarifasSelect(search = '') {
    try {
      const { data } = await api.get('/admin/tarifa', {
        params: { estado: true, search },
      });

      return {
        ok: data?.ok ?? true,
        message: data?.message,
        data: getDataArray(data),
      };
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async getDetallesAccionSelect() {
    try {
      const { data } = await api.get('/admin/accion/detalle/select');

      return {
        ok: data?.ok ?? true,
        message: data?.message,
        data: getDataArray(data),
      };
    } catch (error) {
      return toServiceError(error);
    }
  }
}