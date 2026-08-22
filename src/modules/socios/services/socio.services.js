import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class SocioServices {

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

   
      if (typeof estado === 'boolean') {
        params.estado = estado;
      }

      const { data } = await api.get(
        '/admin/socio',
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
        `/admin/socio/${id}`,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

 
  static async create(payload) {
    try {
      const cleanPayload = {
        ci_socio: String(
          payload.ci_socio || '',
        ).trim(),

        ci_expedido: String(
          payload.ci_expedido || '',
        ).trim(),

        nombres: String(
          payload.nombres || '',
        ).trim(),

        primer_apellido: String(
          payload.primer_apellido || '',
        ).trim(),

        segundo_apellido: String(
          payload.segundo_apellido || '',
        ).trim(),

        numero_celular: String(
          payload.numero_celular || '',
        ).trim(),

        genero: String(
          payload.genero || '',
        )
          .trim()
          .toUpperCase(),

        direccion: String(
          payload.direccion || '',
        ).trim(),
      };

      const { data } = await api.post(
        '/admin/socio',
        cleanPayload,
      );

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async update(id, payload) {
    try {
      const cleanPayload = {};

      

      if (payload.ci_socio !== undefined) {
        cleanPayload.ci_socio = String(
          payload.ci_socio,
        ).trim();
      }

      if (payload.ci_expedido !== undefined) {
        cleanPayload.ci_expedido = String(
          payload.ci_expedido,
        ).trim();
      }

      if (payload.nombres !== undefined) {
        cleanPayload.nombres = String(
          payload.nombres,
        ).trim();
      }

      if (payload.primer_apellido !== undefined) {
        cleanPayload.primer_apellido =
          String(
            payload.primer_apellido,
          ).trim();
      }

      if (payload.segundo_apellido !== undefined) {
        cleanPayload.segundo_apellido =
          String(
            payload.segundo_apellido,
          ).trim();
      }

      if (payload.numero_celular !== undefined) {
        cleanPayload.numero_celular =
          String(
            payload.numero_celular,
          ).trim();
      }

      if (payload.genero !== undefined) {
        cleanPayload.genero = String(
          payload.genero,
        )
          .trim()
          .toUpperCase();
      }

      if (payload.direccion !== undefined) {
        cleanPayload.direccion = String(
          payload.direccion,
        ).trim();
      }

      const { data } = await api.patch(
        `/admin/socio/${id}`,
        cleanPayload,
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