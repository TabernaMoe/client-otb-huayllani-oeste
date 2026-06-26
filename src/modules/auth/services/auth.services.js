import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export const AuthService = {
  async login({ user, password }) {
    try {
      const { data } = await api.post('/login', {
        nombre_usuario: user,
        contrasenia_usuario: password,
      });

      return data;
    } catch (error) {
      return toServiceError(error);
    }
  },

  saveSession(data) {
    const token = data?.token || data?.data?.token || null;

    const user =
      data?.user ||
      data?.usuario ||
      data?.data?.user ||
      data?.data?.usuario ||
      data?.dataUser ||
      data?.data ||
      {
        id: data?.id || null,
        nombre_usuario: data?.nombre_usuario || 'Usuario',
        rol: data?.rol || null,
        estado: data?.estado ?? true,
        permisos: data?.permisos || data?.permissions || [],
      };

    if (token) {
      localStorage.setItem('token', token);
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
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

    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getRole() {
    const user = this.getUser();

    return (
      user?.rol?.nombre_rol ||
      user?.rol?.nombre ||
      user?.nombre_rol ||
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
      user?.rol?.auth_permisos ||
      []
    );
  },

 hasPermission(permissionCode) {
  const role = this.getRole();

  if (role === 'super_admin') {
    return true;
  }

  const requiredPermissions = Array.isArray(permissionCode)
    ? permissionCode
    : [permissionCode];

  const permissions = this.getPermissions();

  const userPermissions = permissions
    .map((permission) => {
      if (typeof permission === 'string') {
        return permission;
      }

      return (
        permission?.codigo_permiso ||
        permission?.code ||
        permission?.nombre_permiso ||
        permission?.codigo ||
        null
      );
    })
    .filter(Boolean); // elimina null/undefined

  // 🔥 Comparación final
  return requiredPermissions.some((required) =>
    userPermissions.includes(required)
  );
},

  isAuthenticated() {
    return Boolean(this.getToken());
  },
};