import { api } from '../../../services/api';
import { sessionStorageAdapter } from '../../../core/storage/sessionStorage';
import { authEvents } from '../../../core/auth/authEvents';

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

function normalizeUserPayload(usuario = {}, fallback = {}) {
  const rol = normalizeRole(usuario.rol ?? fallback.rol);
  const permisos = usuario.permisos ?? fallback.permisos ?? [];

  return {
    id: usuario.id ?? usuario.user_id ?? null,
    nombre_usuario: usuario.nombre_usuario ?? fallback.nombre_usuario ?? '',
    nombre: usuario.nombre ?? usuario.nombre_completo ?? null,
    rol,
    tipo_usuario: inferAccountType(usuario, rol),
    socio_id: usuario.socio_id ?? null,
    permisos,
    debe_cambiar_password: Boolean(usuario.debe_cambiar_password),
  };
}

function normalizeLoginResponse(data) {
  const usuario = data?.usuario ?? data ?? {};

  return {
    ok: data?.ok ?? true,
    message: data?.message ?? 'Inicio de sesión correcto',
    token: data?.token,
    user: normalizeUserPayload(usuario, data),
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

  async getMe() {
    const { data } = await api.get('/login/me');
    const usuario = data?.data ?? data?.usuario ?? {};
    return {
      ok: data?.ok ?? true,
      message: data?.message ?? '',
      user: normalizeUserPayload(usuario, data),
    };
  },

  saveSession(session) {
    sessionStorageAdapter.save({
      token: session.token,
      user: session.user,
    });
    authEvents.emit('sessionChanged', {
      token: session.token,
      user: session.user,
    });
  },

  updateSession(patch) {
    const current = this.getUser();
    if (!current) return null;

    const updated = { ...current, ...patch };
    sessionStorageAdapter.setUser(updated);
    authEvents.emit('sessionChanged', {
      token: this.getToken(),
      user: updated,
    });
    return updated;
  },

  logout() {
    sessionStorageAdapter.clear();
    authEvents.emit('sessionChanged', { token: null, user: null });
  },

  getToken() {
    return sessionStorageAdapter.getToken();
  },

  getUser() {
    return sessionStorageAdapter.getUser();
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

  hasPermission(permission, user = this.getUser()) {
    if (!user) return false;
    if (user.rol === 'super_admin') return true;
    if (!permission) return true;

    const required = Array.isArray(permission) ? permission : [permission];
    const permissions = Array.isArray(user.permisos) ? user.permisos : [];

    return required.some((code) => permissions.includes(code));
  },

  isAuthenticated() {
    return Boolean(this.getToken() && this.getUser());
  },
};
