import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatApiErrorPayload,
  formatZodErrorMessage,
  getApiErrorMessage,
  normalizeApiError,
  toServiceError,
} from '../src/services/error.js';

describe('Frontend — Formateo detallado de errores (error.js)', () => {
  it('extrae el motivo exacto de un error de validación Zod del backend', () => {
    const res = normalizeApiError({
      response: {
        status: 400,
        data: {
          ok: false,
          message: 'Errores de validación',
          errors: [
            {
              field: 'contrasenia',
              message: 'La contraseña debe tener al menos 8 caracteres',
            },
          ],
        },
      },
    });

    assert.equal(res.ok, false);
    assert.equal(res.status, 400);
    assert.equal(
      res.message,
      'Error: La contraseña debe tener al menos 8 caracteres',
    );
    assert.equal(
      res.fieldErrors.contrasenia,
      'La contraseña debe tener al menos 8 caracteres',
    );
  });

  it('combina múltiples errores de validación con etiquetas legibles en español', () => {
    const res = normalizeApiError({
      response: {
        status: 400,
        data: {
          ok: false,
          message: 'Errores de validación',
          errors: [
            { field: 'contrasenia', message: 'Debe tener al menos 8 caracteres' },
            { field: 'cedula_identidad', message: 'Solo admite números' },
          ],
        },
      },
    });

    assert.equal(
      res.message,
      'Error: Contraseña: Debe tener al menos 8 caracteres · Cédula de identidad: Solo admite números',
    );
  });

  it('conserva errores de negocio del backend sin duplicar el prefijo Error:', () => {
    const msg = formatApiErrorPayload({
      ok: false,
      message: 'El CI ya se encuentra registrado',
    });
    assert.equal(msg, 'Error: El CI ya se encuentra registrado');

    const alreadyPrefixed = formatApiErrorPayload({
      message: 'Error: Ya existe una gestión activa',
    });
    assert.equal(alreadyPrefixed, 'Error: Ya existe una gestión activa');
  });

  it('maneja errores de red y timeout en español', () => {
    const net = normalizeApiError({ code: 'ERR_NETWORK', message: 'Network Error' });
    assert.equal(net.message, 'Error: No se pudo conectar con el servidor');

    const timeout = normalizeApiError({ code: 'ECONNABORTED', message: 'timeout' });
    assert.equal(
      timeout.message,
      'Error: Tiempo de espera agotado al conectar con el servidor',
    );
  });

  it('formatZodErrorMessage formatea ZodError y mapas de errores', () => {
    const fromZod = formatZodErrorMessage({
      issues: [{ path: ['monto'], message: 'Debe ser mayor a 0' }],
    });
    assert.equal(fromZod, 'Error: Monto: Debe ser mayor a 0');

    const fromMap = formatZodErrorMessage({
      nombre_calle: 'El nombre es obligatorio',
    });
    assert.equal(fromMap, 'Error: Nombre de calle: El nombre es obligatorio');
  });

  it('toServiceError y getApiErrorMessage propagan message y fieldErrors', () => {
    const err = {
      response: {
        status: 400,
        data: {
          ok: false,
          message: 'Errores de validación',
          errors: [{ field: 'rol_id', message: 'Seleccione un rol' }],
        },
      },
    };
    const svc = toServiceError(err);
    assert.equal(svc.ok, false);
    assert.equal(svc.message, 'Error: Seleccione un rol');
    assert.equal(getApiErrorMessage(err), 'Error: Seleccione un rol');
  });
});
