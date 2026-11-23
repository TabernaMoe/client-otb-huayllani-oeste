import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateUsuario } from '../src/modules/Admin/schema/admin.schema.js';
import { validateRole } from '../src/modules/roles/schema/roles.schema.js';
import { validateSocio } from '../src/modules/socios/schema/socio.schema.js';
import { validateCalle } from '../src/modules/calles/schema/calles.schema.js';
import { validateTarifa } from '../src/modules/tarifas/schema/tarifas.schema.js';
import { gestionSchema } from '../src/modules/gestiones/schema/gestiones.schema.js';
import { periodoIdSchema } from '../src/modules/periodo/schema/periodos.schema.js';

describe('Frontend — Schemas Zod (Bloque 1)', () => {
  it('validateUsuario exige contraseña >= 3 al crear y permite vacía al editar', () => {
    const base = {
      cargo: 'Tesorero',
      cedula_identidad: '1234567',
      ci_expedido: 'CB',
      nombre: 'Juan',
      apellido_paterno: 'Perez',
      apellido_materno: 'Lopez',
      contrasenia: '12',
      rol_id: 2,
    };

    const failCreate = validateUsuario(base, { isEditing: false });
    assert.equal(failCreate.success, false);
    assert.match(failCreate.errors.contrasenia, /3 caracteres/i);

    const okEdit = validateUsuario(
      { ...base, contrasenia: '' },
      { isEditing: true },
    );
    assert.equal(okEdit.success, true);
    assert.equal('contrasenia' in okEdit.data, false);
  });

  it('validateRole requiere nombre y al menos un permiso', () => {
    const fail = validateRole({ nombre_rol: '', permisos: [] });
    assert.equal(fail.success, false);
    assert.ok(fail.errors.nombre_rol);
    assert.ok(fail.errors.permisos);

    const ok = validateRole({ nombre_rol: 'Cobrador', permisos: [1, 2] });
    assert.equal(ok.success, true);
  });

  it('validateSocio valida CI numérico, celular de 8 dígitos y género', () => {
    const ok = validateSocio({
      ci_socio: '7654321',
      ci_expedido: 'CB',
      nombres: 'Maria',
      primer_apellido: 'Gomez',
      segundo_apellido: 'Rojas',
      numero_celular: '70123456',
      genero: 'FEMENINO',
      direccion: 'Av. Principal #123',
    });
    assert.equal(ok.success, true);

    const bad = validateSocio({
      ci_socio: 'abc',
      ci_expedido: '',
      nombres: '1',
      primer_apellido: '',
      segundo_apellido: '',
      numero_celular: '123',
      genero: 'OTRO',
      direccion: 'ab',
    });
    assert.equal(bad.success, false);
    assert.ok(bad.errors.ci_socio);
    assert.ok(bad.errors.numero_celular);
  });

  it('validateCalle valida longitud mínima', () => {
    assert.equal(validateCalle({ nombre_calle: 'A' }).success, false);
    assert.equal(validateCalle({ nombre_calle: 'Calle Perú' }).success, true);
  });

  it('validateTarifa valida continuidad de rangos y precio positivo', () => {
    const valid = validateTarifa({
      nombre_tarifa: 'Domiciliaria',
      rangosTarifa: [
        { consumo_minimo: 0, consumo_maximo: 10, precio: 15 },
        { consumo_minimo: 11, consumo_maximo: '', precio: 25 },
      ],
    });
    assert.equal(valid.success, true);

    const brokenGap = validateTarifa({
      nombre_tarifa: 'Domiciliaria',
      rangosTarifa: [
        { consumo_minimo: 0, consumo_maximo: 10, precio: 15 },
        { consumo_minimo: 15, consumo_maximo: '', precio: 25 },
      ],
    });
    assert.equal(brokenGap.success, false);
    assert.ok(brokenGap.errors.consumo_minimo_1);
  });

  it('gestionSchema y periodoIdSchema validan rangos válidos', () => {
    assert.equal(gestionSchema.safeParse({ anio: 2026 }).success, true);
    assert.equal(gestionSchema.safeParse({ anio: 1990 }).success, false);
    assert.equal(periodoIdSchema.safeParse(5).success, true);
    assert.equal(periodoIdSchema.safeParse(0).success, false);
  });
});
