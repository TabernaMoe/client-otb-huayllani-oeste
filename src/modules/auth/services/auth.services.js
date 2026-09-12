import { api } from '../../../services/api';

const SESSION_KEY = 'user';
const TOKEN_KEY = 'token';

export const AuthService = {
  async login({ user, password }) {
    const { data } = await api.post('/login', {
      nombre_usuario: user,
      contrasenia_usuario: password,
    });

    return data;
  },

  saveSession({ token, nombre_usuario, rol, permisos = [] }) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ nombre_usuario, rol, permisos }),
    );
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : null;
  },

  getRole() {
    return this.getUser()?.rol || null;
  },

  getPermissions() {
    return this.getUser()?.permisos || [];
  },

  hasPermission(permission) {
    if (this.getRole() === 'super_admin') return true;

    const required = Array.isArray(permission) ? permission : [permission];
    const permissions = this.getPermissions();

    return required.some((code) => permissions.includes(code));
  },

  isAuthenticated() {
    return Boolean(this.getToken() && this.getUser());
  },
};
