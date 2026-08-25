import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class CobrosServices {
 
  static async getCobros(params = {}) {
    try {
      const response = await api.get('/admin/cobro', {
        params,
      });

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  
  static async getSocioCobros(socioId) {
    try {
      

      const response = await api.get(
        `/admin/cobro/${socioId}`,
      );

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }

  static async pagar(payload) {
    try {
    
      const response = await api.post(
        '/admin/cobro',
        payload,
      );

      return response.data;
    } catch (error) {
      return toServiceError(error);
    }
  }
}