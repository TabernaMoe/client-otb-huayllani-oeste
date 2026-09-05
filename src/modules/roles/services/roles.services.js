import { api,} from '../../../services/api';
import { toServiceError,} from '../../../services/error';
export class RolesServices {

  static async getAllPermisos() {
    try { const { data,
      } = await api.get( '/admin/auth/roles/permisos',);
     
      return data;

    } catch (error) {
      const serviceError =
        toServiceError(
          error,
        );
      return serviceError;
    }
  }

  static async getAllRoles(
    params = {},
  ) {
    


    try {

      const {
        data,
      } = await api.get(
        '/admin/auth/roles',
        {
          params,
        },
      );
    
      return data;
    } catch (error) {
      const serviceError =
        toServiceError(
          error,
        );
      return serviceError;
    }
  }

  static async getById(
    id,
  ) {
 


    try {

      const {
        data,
      } = await api.get(
        `/admin/auth/roles/${id}`,
      );


      return data;

    } catch (error) {


      const serviceError =
        toServiceError(
          error,
        );


      return serviceError;
    }
  }


  static async create(
    payload,
  ) {
    try {

      const {
        data,
      } = await api.post(
        '/admin/auth/roles',
        payload,
      );
      return data;

    } catch (error) {
      const serviceError =
        toServiceError(
          error,
        );
      return serviceError;
    }
  }

  static async update(
    id,
    payload,
  ) {
    try {
      const {
        data,
      } = await api.patch(
        `/admin/auth/roles/${id}`,
        payload,
      );
      return data;
    } catch (error) {
      const serviceError =
        toServiceError(
          error,
        );
      return serviceError;
    }
  }
}