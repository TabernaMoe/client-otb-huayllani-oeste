import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export const AuthService = {
  async login({ user, password }) {
    try {
      const { data } = await api.post('/auth/login', {
        user,
        password,
      });

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  },

  saveSession(data) {
    const token = data?.token;
    const user = data?.user || data?.usuario;

    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

 getRole() {
  const user = this.getUser();

  return (
    user?.rol?.nombre_rol ||
    user?.rol ||
    user?.role ||
    null
  );
},
getPermissions() {
  const user = this.getUser();

  return (
    user?.permisos ||
    user?.permissions ||
    user?.rol?.permisos ||
    user?.rol?.permissions ||
    []
  );
},

hasPermission(permissionCode) {
  const permissions = this.getPermissions();

  return permissions.some((permission) => {
    if (typeof permission === 'string') {
      return permission === permissionCode;
    }

    return (
      permission?.codigo_permiso === permissionCode ||
      permission?.code === permissionCode ||
      permission?.nombre_permiso === permissionCode
    );
  });
},

isAuthenticated() {
  return Boolean(this.getToken());
},

};