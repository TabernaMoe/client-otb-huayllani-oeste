import { afterEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { api } from '../src/services/api.js';

import { AuthService } from '../src/modules/auth/services/auth.services.js';
import { AdminServices } from '../src/modules/Admin/services/admin.services.js';
import { DashboardServices } from '../src/modules/Admin/services/dashboard.services.js';
import { RolesServices } from '../src/modules/roles/services/roles.services.js';
import { SocioServices } from '../src/modules/socios/services/socio.services.js';
import { CallesServices } from '../src/modules/calles/services/calles.services.js';
import { TarifasServices } from '../src/modules/tarifas/services/tarifas.services.js';
import { GestionesServices } from '../src/modules/gestiones/services/gestiones.services.js';
import { PeriodosServices } from '../src/modules/periodo/services/periodos.services.js';
import { AccionesServices } from '../src/modules/acciones/services/acciones.services.js';
import { AdelantoPagosServices } from '../src/modules/adelantoPagos/services/adelantoPagos.services.js';
import { DetalleAccionServices } from '../src/modules/detalleAccion/services/detalleAccion.services.js';
import { TipoAccionServices } from '../src/modules/tipoAccion/services/tipoAccion.services.js';
import { AlcantarilladoServices as AccionesAlcantarilladoServices } from '../src/modules/alcantarillado/services/accionesAlcantarillado.services.js';
import { AlcantarilladoServices as DetalleAlcantarilladoServices } from '../src/modules/alcantarillado/services/alcantarillado.services.js';
import { CambioNombreServices } from '../src/modules/cambioNombre/services/cambioNombre.services.js';
import { CobrosServices } from '../src/modules/cobros/services/cobros.services.js';
import { ReciboMadreSerivices } from '../src/modules/reciboUniversal/services.js';
import { LecturasServices } from '../src/modules/lecturas/services/lecturas.services.js';
import { AsambleasServices } from '../src/modules/asambleas/services/asambleas.services.js';
import { MultasServices } from '../src/modules/multas/services/multas.services.js';
import { InventarioServices } from '../src/modules/inventario/inventario.services.js';
import { EgresosServices } from '../src/modules/egresos/services/egresos.services.js';
import { ReportesApiService } from '../src/modules/reportes/services/reportes.services.js';
import { ReciboServices } from '../src/modules/reportes/recibos/services/services.js';
import { SocioPortalServices } from '../src/modules/socioPortal/services/socioPortal.services.js';

function spyApi(defaultData = { ok: true, data: [] }) {
  const calls = [];
  for (const method of ['get', 'post', 'patch', 'put', 'delete']) {
    mock.method(api, method, async (url, arg2, arg3) => {
      calls.push({ method: method.toUpperCase(), url, arg2, arg3 });
      return {
        data: typeof defaultData === 'function' ? defaultData(method, url) : defaultData,
        headers: { 'content-type': 'application/json' },
      };
    });
  }
  return calls;
}

afterEach(() => {
  mock.restoreAll();
});

describe('Frontend — Unit tests de todos los servicios y endpoints por módulo', () => {
  it('auth: POST /login y GET /login/me normalizan usuario y rol', async () => {
    const calls = spyApi({
      ok: true,
      token: 'jwt-123',
      usuario: {
        id: 1,
        nombre_usuario: 'admin',
        nombre: 'Admin',
        rol: 'super_admin',
        tipo_usuario: 'ADMIN',
        permisos: ['socio.ver'],
      },
    });

    const loginRes = await AuthService.login({ user: 'admin', password: '123' });
    assert.equal(calls[0].method, 'POST');
    assert.equal(calls[0].url, '/login');
    assert.equal(loginRes.token, 'jwt-123');
    assert.equal(loginRes.user.tipo_usuario, 'ADMIN');

    await AuthService.getMe();
    assert.equal(calls[1].method, 'GET');
    assert.equal(calls[1].url, '/login/me');
  });

  it('Admin + Dashboard: endpoints y adapters (cedula_indentidad e id en getById)', async () => {
    const calls = spyApi((method, url) => {
      if (url === '/admin/persona-admin/') {
        return {
          ok: true,
          data: {
            total: 1,
            totalPages: 1,
            data: [{ id: 7, cedula_indentidad: '55555', nombre_completo: 'Ana' }],
          },
        };
      }
      if (url === '/admin/persona-admin/7' && method === 'get') {
        return { ok: true, data: { cargo: 'Secretaria', cedula_identidad: '55555' } };
      }
      return { ok: true, data: [] };
    });

    await AdminServices.getRoles();
    const list = await AdminServices.getAll({ page: 1, limit: 10 });
    assert.equal(list.data.data[0].cedula_identidad, '55555');

    const one = await AdminServices.getById(7);
    assert.equal(one.data.id, 7);

    await AdminServices.create({ nombre: 'Ana' });
    await AdminServices.update(7, { cargo: 'Tesorera' });
    await AdminServices.toggleStatus(7);
    await DashboardServices.getSocios({ page: 1, limit: 5 });
    await DashboardServices.getAcciones({ page: 1, limit: 1 });

    assert.deepEqual(
      calls.map((c) => `${c.method} ${c.url}`),
      [
        'GET /admin/persona-admin/rol',
        'GET /admin/persona-admin/',
        'GET /admin/persona-admin/7',
        'POST /admin/persona-admin',
        'PATCH /admin/persona-admin/7',
        'PATCH /admin/persona-admin/cambiar-estado/7',
        'GET /admin/socio',
        'GET /admin/accion',
      ],
    );
  });

  it('roles: endpoints y adapter dato -> data en getById', async () => {
    const calls = spyApi((method, url) =>
      url === '/admin/auth/roles/3' && method === 'get'
        ? { ok: true, dato: { id: 3, nombre_rol: 'Cobrador', permisos: [1] } }
        : { ok: true, data: [] },
    );

    await RolesServices.getAllPermisos();
    await RolesServices.getAllRoles({ page: 1 });
    const role = await RolesServices.getById(3);
    assert.equal(role.data.nombre_rol, 'Cobrador');
    await RolesServices.create({ nombre_rol: 'X', permisos: [1] });
    await RolesServices.update(3, { nombre_rol: 'Y', permisos: [1] });

    assert.deepEqual(
      calls.map((c) => `${c.method} ${c.url}`),
      [
        'GET /admin/auth/roles/permisos',
        'GET /admin/auth/roles',
        'GET /admin/auth/roles/3',
        'POST /admin/auth/roles',
        'PATCH /admin/auth/roles/3',
      ],
    );
  });

  it('socios, calles, tarifas, gestiones y periodo: endpoints CRUD completos', async () => {
    const calls = spyApi({ ok: true, data: [], dato: { id: 2, nombre_tarifa: 'A' } });

    await SocioServices.getAll({ page: 1 });
    await SocioServices.getDetalle(2);
    await SocioServices.create({});
    await SocioServices.update(2, {});
    await SocioServices.changeEstado(2);

    await CallesServices.getAll({ page: 1 });
    await CallesServices.create({ nombre_calle: 'Perú' });
    await CallesServices.update(4, { nombre_calle: 'Bolívar' });
    await CallesServices.toggleStatus(4);

    await TarifasServices.getAll({ page: 1 });
    const tarifa = await TarifasServices.getById(2);
    assert.equal(tarifa.data.nombre_tarifa, 'A');
    await TarifasServices.create({});
    await TarifasServices.update(2, {});
    await TarifasServices.changeEstado(2);

    await GestionesServices.getAll({ page: 1 });
    await GestionesServices.create({ anio: 2027 });

    await PeriodosServices.getAll({ page: 1 });
    await PeriodosServices.cerrar(8);

    assert.deepEqual(
      calls.map((c) => `${c.method} ${c.url}`),
      [
        'GET /admin/socio',
        'GET /admin/socio/detalle/2',
        'POST /admin/socio',
        'PATCH /admin/socio/2',
        'PATCH /admin/socio/cambiar-estado/2',
        'GET /admin/calle',
        'POST /admin/calle',
        'PATCH /admin/calle/4',
        'PATCH /admin/calle/cambiar-estado/4',
        'GET /admin/tarifa',
        'GET /admin/tarifa/2',
        'POST /admin/tarifa',
        'PATCH /admin/tarifa/2',
        'PATCH /admin/tarifa/cambiar-estado/2',
        'GET /admin/gestion',
        'POST /admin/gestion',
        'GET /admin/gestion/periodo',
        'PATCH /admin/gestion/periodo/cerrar/8',
      ],
    );
  });

  it('acciones, adelantoPagos, detalleAccion y tipoAccion: endpoints activos', async () => {
    const calls = spyApi({ ok: true, data: [] });

    await AccionesServices.getAll({ page: 1, limit: 10 });
    await AccionesServices.getById(10);
    await AccionesServices.getTiposAccion();
    await AccionesServices.getDetallesAccion(1);
    await AccionesServices.getDetalleAccionById(2);
    await AccionesServices.getSocios();
    await AccionesServices.getTarifas();
    await AccionesServices.create({});
    await AccionesServices.update(10, {});
    await AccionesServices.getHistorialAccion(10);

    await AdelantoPagosServices.getAccionesPasivas({ page: 1, limit: 10 });

    await DetalleAccionServices.getAll();
    await DetalleAccionServices.getTiposAccion();
    await DetalleAccionServices.getById(3);
    await DetalleAccionServices.create({});
    await DetalleAccionServices.update(3, {});
    await DetalleAccionServices.changeEstado(3);

    await TipoAccionServices.getAll();
    await TipoAccionServices.create({});
    await TipoAccionServices.update(1, {});

    assert.deepEqual(
      calls.map((c) => `${c.method} ${c.url}`),
      [
        'GET /admin/acciones/agua',
        'GET /admin/acciones/agua/10',
        'GET /admin/acciones/agua/tipos-accion',
        'GET /admin/acciones/agua/detalle-accion/1',
        'GET /admin/acciones/agua/detalle/2',
        'GET /admin/acciones/agua/socios',
        'GET /admin/acciones/agua/tarifa',
        'POST /admin/acciones/agua',
        'PATCH /admin/acciones/agua/10',
        'GET /admin/cobro/accion-historial/10',
        'GET /admin/cobro/acciones-pasivas',
        'GET /admin/acciones/agua/detalle',
        'GET /admin/acciones/agua/detalle/tipos-accion',
        'GET /admin/acciones/agua/detalle/3',
        'POST /admin/acciones/agua/detalle',
        'PATCH /admin/acciones/agua/detalle/3',
        'PATCH /admin/acciones/agua/detalle/change-status/3',
        'GET /admin/acciones/agua/tipo-accion',
        'POST /admin/acciones/agua/tipo-accion',
        'PUT /admin/acciones/agua/tipo-accion/1',
      ],
    );
  });

  it('alcantarillado y cambioNombre: endpoints activos', async () => {
    const calls = spyApi({ ok: true, data: [] });

    await AccionesAlcantarilladoServices.getAll({});
    await AccionesAlcantarilladoServices.getId({ id: 5 });
    await AccionesAlcantarilladoServices.getSocios();
    await AccionesAlcantarilladoServices.getCalles();
    await AccionesAlcantarilladoServices.getDetalle();
    await AccionesAlcantarilladoServices.create({ payload: {} });
    await AccionesAlcantarilladoServices.update({ id: 5, payload: {} });

    await DetalleAlcantarilladoServices.getAll({});
    await DetalleAlcantarilladoServices.create({});
    await DetalleAlcantarilladoServices.update(2, {});
    await DetalleAlcantarilladoServices.changeEstado(2);

    await CambioNombreServices.getAcciones('AGUA');
    await CambioNombreServices.getSocios();
    await CambioNombreServices.create({}, 'AGUA');
    await CambioNombreServices.create({}, 'ALCANTARILLADO');

    assert.deepEqual(
      calls.map((c) => `${c.method} ${c.url}`),
      [
        'GET /admin/acciones/alcantarillado',
        'GET /admin/acciones/alcantarillado/5',
        'GET /admin/acciones/alcantarillado/socio',
        'GET /admin/acciones/alcantarillado/calle',
        'GET /admin/acciones/alcantarillado/detalles-accion',
        'POST /admin/acciones/alcantarillado',
        'PATCH /admin/acciones/alcantarillado/5',
        'GET /admin/acciones/alcantarillado/detalle',
        'POST /admin/acciones/alcantarillado/detalle',
        'PATCH /admin/acciones/alcantarillado/detalle/2',
        'PATCH /admin/acciones/alcantarillado/detalle/change-status/2',
        'GET /admin/reportes/recibo/acciones',
        'GET /admin/acciones/agua/socios',
        'POST /admin/acciones/agua/cambiar-nombre',
        'POST /admin/acciones/alcantarillado/cambiar-nombre',
      ],
    );
  });

  it('cobros, cobroUniversal y lecturas: endpoints activos', async () => {
    const calls = spyApi({ ok: true, data: [] });

    await CobrosServices.getSocios({});
    await CobrosServices.getAccionesByServicio('AGUA');
    await CobrosServices.getCobrosBySocio(4);
    await CobrosServices.getCobrosByAccion(9);
    await CobrosServices.pagar({ metodo_pago: 'EFECTIVO', monto: 50, cobros: [1] });

    await ReciboMadreSerivices.getSelectAccion();
    await ReciboMadreSerivices.createCobro({ payload: {} });

    await LecturasServices.getAll();
    await LecturasServices.create(9, { lectura_actual: 100 });

    assert.deepEqual(
      calls.map((c) => `${c.method} ${c.url}`),
      [
        'GET /admin/socio',
        'GET /admin/reportes/recibo/acciones',
        'GET /admin/cobros-generales/cobros/socios/4',
        'GET /admin/cobros-generales/cobros/accion/9',
        'POST /admin/cobros-generales/cobros/pagar',
        'GET /admin/reportes/recibo/acciones',
        'POST /admin/cobro/crear-cobro',
        'GET /admin/lectura/lectura',
        'POST /admin/lectura/lectura/9',
      ],
    );
  });

  it('asambleas, multas, inventario, egresos, reportes y socioPortal: endpoints activos', async () => {
    const calls = spyApi({ ok: true, data: [] });

    await AsambleasServices.getAll({});
    await AsambleasServices.create({});
    await AsambleasServices.update(1, {});
    await AsambleasServices.getAcciones(1);
    await AsambleasServices.updateAsistencia(2, {});
    await AsambleasServices.getReporte(1);

    await MultasServices.getAll({});
    await MultasServices.create({});
    await MultasServices.update(1, {});
    await MultasServices.cambiarEstado(1);

    await InventarioServices.getAll({});
    await InventarioServices.create({});
    await InventarioServices.update(1, {});
    await InventarioServices.sumar(1);
    await InventarioServices.restar(1);

    await EgresosServices.getAll();
    await EgresosServices.create({});
    await EgresosServices.getCategorias();
    await EgresosServices.createCategoria({});

    await ReportesApiService.getCobros({ page: 1, limit: 10 });
    await ReportesApiService.getCobrosPorFecha({});
    await ReportesApiService.getRecibos({ page: 1, limit: 10 });
    await ReportesApiService.getRecibosPorFecha({});

    await ReciboServices.getAll();
    await ReciboServices.getAccionesByServicio({ tipo_servicio: 'AGUA' });
    await ReciboServices.getRecibosByAccion({ id: 4 });

    await SocioPortalServices.getResumen();
    await SocioPortalServices.getPerfil();
    await SocioPortalServices.updatePerfil({ numero_celular: '70000000', direccion: 'Av. 1' });
    await SocioPortalServices.getAcciones();
    await SocioPortalServices.getLecturas(4);
    await SocioPortalServices.getCobros(4);
    await SocioPortalServices.getRecibos(4);
    await SocioPortalServices.cambiarPassword({ contrasenia_actual: 'a', contrasenia_nueva: 'b' });

    assert.deepEqual(
      calls.map((c) => `${c.method} ${c.url}`),
      [
        'GET /admin/asamblea',
        'POST /admin/asamblea',
        'PATCH /admin/asamblea/1',
        'GET /admin/asamblea/acciones/1',
        'PATCH /admin/asamblea/accion/2',
        'GET /admin/asamblea/reporte/1',
        'GET /admin/multa',
        'POST /admin/multa',
        'PATCH /admin/multa/1',
        'PATCH /admin/multa/cambiar-estado/1',
        'GET /admin/inventario',
        'POST /admin/inventario',
        'PATCH /admin/inventario/1',
        'GET /admin/inventario/sumar/1',
        'GET /admin/inventario/restar/1',
        'GET /admin/egresos',
        'POST /admin/egresos',
        'GET /admin/egresos/categoria-gastos',
        'POST /admin/egresos/categoria-gastos',
        'GET /admin/reportes/cobro',
        'POST /admin/reportes/cobro/fechas',
        'GET /admin/reportes/recibo',
        'POST /admin/reportes/recibo/fechas',
        'GET /admin/cobros-generales/recibos',
        'GET /admin/reportes/recibo/acciones',
        'GET /admin/cobros-generales/recibos/accion/4',
        'GET /socio/me/resumen',
        'GET /socio/me',
        'PATCH /socio/me',
        'GET /socio/me/acciones',
        'GET /socio/me/lecturas',
        'GET /socio/me/cobros',
        'GET /socio/me/recibos',
        'PATCH /socio/me/password',
      ],
    );
  });
});
