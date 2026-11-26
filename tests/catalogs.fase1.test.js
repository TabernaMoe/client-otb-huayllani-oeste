import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  formatDate,
  formatCurrency,
  formatFullName,
} from '../src/utils/formatters.js';
import { withBooleanEstado } from '../src/core/constants/catalogFilters.js';
import { validateTipoAccion } from '../src/modules/tipoAccion/schema/tipoAccion.schema.js';

describe('Fase 1 — Catálogos Maestros y Formateadores', () => {
  it('formatDate y formatCurrency manejan valores nulos o inválidos sin lanzar error ni NaN', () => {
    assert.equal(formatDate(null), '—');
    assert.equal(formatDate('fecha-invalida'), '—');
    assert.notEqual(formatDate('2026-05-15T12:00:00Z'), '—');

    assert.match(formatCurrency(undefined), /0[.,]00/);
    assert.match(formatCurrency('NaN'), /0[.,]00/);
    assert.match(formatCurrency(45.5), /45[.,]50/);
  });

  it('formatFullName resuelve nombre_completo, campos de socio y campos de admin', () => {
    assert.equal(formatFullName(null), 'Sin nombre');
    assert.equal(
      formatFullName({ nombre_completo: '  Ana Pérez  ' }),
      'Ana Pérez',
    );
    assert.equal(
      formatFullName({
        nombres: 'Juan',
        primer_apellido: 'Quispe',
        segundo_apellido: 'Mamani',
      }),
      'Juan Quispe Mamani',
    );
    assert.equal(
      formatFullName({
        nombre: 'María',
        apellido_paterno: 'López',
      }),
      'María López',
    );
  });

  it('withBooleanEstado convierte "true"/"false" a booleano y preserva otros params', async () => {
    let received = null;
    const wrapped = withBooleanEstado(async (params) => {
      received = params;
      return { ok: true, data: [] };
    });

    await wrapped({ page: 1, estado: 'true', search: 'calle' });
    assert.deepEqual(received, { page: 1, estado: true, search: 'calle' });

    await wrapped({ page: 2, estado: 'false' });
    assert.deepEqual(received, { page: 2, estado: false });

    await wrapped({ page: 3 });
    assert.deepEqual(received, { page: 3 });
  });

  it('validateTipoAccion valida longitud mínima y recorta espacios', () => {
    const invalid = validateTipoAccion({ nombre_tipo_accion: 'ab' });
    assert.equal(invalid.success, false);
    assert.ok(invalid.errors.nombre_tipo_accion);

    const valid = validateTipoAccion({ nombre_tipo_accion: '  Agua Domiciliaria  ' });
    assert.equal(valid.success, true);
    assert.deepEqual(valid.data, { nombre_tipo_accion: 'Agua Domiciliaria' });
  });
});
