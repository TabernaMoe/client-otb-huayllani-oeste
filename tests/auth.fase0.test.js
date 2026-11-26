import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { sessionStorageAdapter } from '../src/core/storage/sessionStorage.js';
import { authEvents } from '../src/core/auth/authEvents.js';
import { validateLoginForm } from '../src/modules/auth/schema/auth.schema.js';
import { getHomeRoute } from '../src/modules/auth/utils/authRedirect.js';

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

describe('Fase 0 — Infraestructura Auth, Storage y Rutas', () => {
  beforeEach(() => {
    globalThis.localStorage = createMemoryStorage();
  });

  it('sessionStorageAdapter guarda, lee y limpia sesión de forma segura', () => {
    sessionStorageAdapter.save({
      token: 'jwt-123',
      user: { id: 1, nombre_usuario: 'admin', tipo_usuario: 'ADMIN' },
    });

    assert.equal(sessionStorageAdapter.getToken(), 'jwt-123');
    assert.deepEqual(sessionStorageAdapter.getUser(), {
      id: 1,
      nombre_usuario: 'admin',
      tipo_usuario: 'ADMIN',
    });

    sessionStorageAdapter.clear();
    assert.equal(sessionStorageAdapter.getToken(), null);
    assert.equal(sessionStorageAdapter.getUser(), null);
  });

  it('sessionStorageAdapter limpia automáticamente si el JSON de user está corrupto', () => {
    globalThis.localStorage.setItem('token', 'jwt-123');
    globalThis.localStorage.setItem('user', '{corrupt-json');

    assert.equal(sessionStorageAdapter.getUser(), null);
    assert.equal(sessionStorageAdapter.getToken(), null);
  });

  it('authEvents suscribe, emite, desuscribe y aísla errores de listeners', () => {
    const received = [];
    const offBad = authEvents.on('unauthorized', () => {
      throw new Error('boom');
    });
    const offGood = authEvents.on('unauthorized', (payload) => {
      received.push(payload);
    });

    authEvents.emit('unauthorized', { status: 401 });
    assert.equal(received.length, 1);
    assert.equal(received[0].status, 401);

    offBad();
    offGood();
    authEvents.emit('unauthorized', { status: 401 });
    assert.equal(received.length, 1);
  });

  it('validateLoginForm valida con Zod y recorta espacios', () => {
    const invalid = validateLoginForm({ user: '   ', password: '' });
    assert.equal(invalid.isValid, false);
    assert.ok(invalid.errors.user);
    assert.ok(invalid.errors.password);

    const valid = validateLoginForm({ user: '  super_admin  ', password: ' 123456 ' });
    assert.equal(valid.isValid, true);
    assert.deepEqual(valid.data, { user: 'super_admin', password: '123456' });
  });

  it('getHomeRoute redirige según tipo_usuario y debe_cambiar_password', () => {
    assert.equal(getHomeRoute(null), '/login');
    assert.equal(getHomeRoute({ tipo_usuario: 'ADMIN' }), '/admin/dashboard');
    assert.equal(
      getHomeRoute({ tipo_usuario: 'SOCIO', debe_cambiar_password: false }),
      '/socio/inicio',
    );
    assert.equal(
      getHomeRoute({ tipo_usuario: 'SOCIO', debe_cambiar_password: true }),
      '/socio/cambiar-contrasena',
    );
  });
});
