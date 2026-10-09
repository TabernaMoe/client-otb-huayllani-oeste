import { api } from '../../../services/api';

const SESSION_KEY = 'user';
const TOKEN_KEY = 'token';

function normalizeRole(role) {
  if (!role) return null;
  if (typeof role === 'string') return role;
  return role.nombre_rol || role.name || null;
}

function inferAccountType(usuario, role) {
  if (usuario?.tipo_usuario) {
    return String(usuario.tipo_usuario).toUpperCase();
  }

  return String(role || '').toLowerCase() === 'usuario_normal'
    ? 'SOCIO'
    : 'ADMIN';
}

function normalizeLoginResponse(data) {
  const usuario = data?.usuario ?? data ?? {};
  const rol = normalizeRole(usuario.rol ?? data?.rol);
  const permisos = usuario.permisos ?? data?.permisos ?? [];

  return {
    ok: data?.ok ?? true,
    message: data?.message ?? 'Inicio de sesión correcto',
    token: data?.token,
    user: {
      id: usuario.id ?? null,
      nombre_usuario: usuario.nombre_usuario ?? data?.nombre_usuario ?? '',
      nombre: usuario.nombre ?? usuario.nombre_completo ?? null,
      rol,
      tipo_usuario: inferAccountType(usuario, rol),
      socio_id: usuario.socio_id ?? null,
      permisos,
      debe_cambiar_password: Boolean(usuario.debe_cambiar_password),
    },
  };
}

export const AuthService = {
  async login({ user, password }) {
    const { data } = await api.post('/login', {
      nombre_usuario: user,
      contrasenia_usuario: password,
    });

    return normalizeLoginResponse(data);
  },

  saveSession(session) {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session.user));
  },

  updateSession(patch) {
    const current = this.getUser();
    if (!current) return;

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...current, ...patch }),
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
    return this.getUser()?.rol ?? null;
  },

  getAccountType() {
    return this.getUser()?.tipo_usuario ?? null;
  },

  getSocioId() {
    return this.getUser()?.socio_id ?? null;
  },

  getPermissions() {
    return this.getUser()?.permisos ?? [];
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
