import { Navigate, Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import PermissionRoute from './PermissionRoute';
import AdminRoute from './AdminRoute';
import ClienteRoute from './ClienteRoute';

import AdminLayout from '../layouts/AdminLayout';
import ClienteLayout from '../layouts/ClienteLayout';

import AdminDashboardPage from '../modules/Admin/pages/AdminDashboardPage';
import AdminPage from '../modules/Admin/pages/AdminPage';
import ReportesPage from '../modules/Admin/pages/ReportesPage';
import RolesPage from '../modules/roles/pages/RolesPage';
import GestionesPage from '../modules/gestiones/pages/GestionesPage';
import PeriodosPage from '../modules/periodo/pages/PeriodosPage';
import SocioPage from '../modules/socios/pages/SocioPage';
import AccionesPage from '../modules/acciones/pages/AccionesPage';
import DetalleAccionPage from '../modules/detalleAccion/pages/DetalleAccionPage';
import CobrosPage from '../modules/cobros/pages/CobrosPage';
import AlcantarilladoPage from '../modules/alcantarillado/pages/AlcantarilladoPage';
import CambioNombrePage from '../modules/cambioNombre/pages/CambioNombrePage';
import LecturasPage from '../modules/lecturas/pages/LecturasPage';
import CobrosAguaPage from '../modules/cobrosAgua/pages/CobrosAguaPage';
import TarifasPage from '../modules/tarifas/pages/TarifasPage';
import CallesPage from '../modules/calles/pages/CallesPage';
import AsambleasPage from '../modules/asambleas/pages/AsambleasPage';
import TipoAccionPage from '../modules/tipoAccion/pages/TipoAccionPage';
import InventarioPage from '../modules/inventario/pages/InventarioPage';
import MultasPage from '../modules/multas/pages/MultasPage';
import ClientePerfilPage from '../modules/client/pages/ClientePerfilPage';
import ClienteDashboardPage from '../modules/client/pages/ClienteDashboardPage';

const permission = (codes) => (
  <PermissionRoute permission={codes} />
);

export const privateRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />

        <Route element={permission(['usuario.ver', 'usuarios.ver', 'auth.usuario.ver'])}>
          <Route path="usuarios" element={<AdminPage />} />
        </Route>

        <Route element={permission(['rol.ver', 'roles.ver', 'auth.rol.ver'])}>
          <Route path="roles" element={<RolesPage />} />
        </Route>

        <Route element={permission(['gestion.ver', 'gestiones.ver'])}>
          <Route path="gestiones" element={<GestionesPage />} />
        </Route>

        <Route
          element={permission([
            'periodo.ver',
            'periodos.ver',
            'gestion.ver',
            'gestiones.ver',
          ])}
        >
          <Route path="periodos" element={<PeriodosPage />} />
        </Route>

        <Route
          element={permission([
            'acciones.accion.ver',
            'accion.ver',
            'acciones.ver',
          ])}
        >
          <Route path="acciones" element={<AccionesPage />} />
          <Route path="alcantarillado" element={<AlcantarilladoPage />} />
          <Route path="cambio-nombre" element={<CambioNombrePage />} />
          <Route path="tipo-accion" element={<TipoAccionPage />} />
        </Route>

        <Route element={permission(['inventario.ver'])}>
          <Route path="inventario" element={<InventarioPage />} />
        </Route>

        <Route element={permission(['socio.ver', 'socios.ver', 'socios.socio.ver'])}>
          <Route path="socios" element={<SocioPage />} />
        </Route>

        <Route element={permission(['calle.ver', 'calles.ver', 'acciones.calles.ver'])}>
          <Route path="calles" element={<CallesPage />} />
        </Route>

        <Route element={permission(['tarifa.ver', 'tarifas.ver'])}>
          <Route path="tarifas" element={<TarifasPage />} />
        </Route>

        <Route
          element={permission([
            'acciones.detalle.ver',
            'acciones.detalles.ver',
            'detalle_accion.ver',
            'detalle_pago_accion.ver',
          ])}
        >
          <Route path="detalle-pago-accion" element={<DetalleAccionPage />} />
        </Route>

        <Route element={permission(['multa.ver', 'multas.ver'])}>
          <Route path="multas" element={<MultasPage />} />
        </Route>

        <Route element={permission(['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver'])}>
          <Route path="cobros" element={<CobrosPage />} />
        </Route>

        <Route element={permission(['lectura.ver', 'lecturas.ver', 'agua.lectura.ver'])}>
          <Route path="lecturas" element={<LecturasPage />} />
        </Route>

        <Route
          element={permission([
            'pago_agua.ver',
            'pago-agua.ver',
            'cobro_agua.ver',
            'cobros_agua.ver',
            'agua.cobro.ver',
          ])}
        >
          <Route path="cobros-agua" element={<CobrosAguaPage />} />
        </Route>

        <Route
          element={permission([
            'asamblea.ver',
            'asambleas.ver',
            'reunion.ver',
            'reuniones.ver',
          ])}
        >
          <Route path="asambleas" element={<AsambleasPage />} />
        </Route>

        <Route element={permission(['reporte.ver', 'reportes.ver'])}>
          <Route path="reportes" element={<ReportesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Route>

    <Route element={<ClienteRoute />}>
      <Route path="/cliente" element={<ClienteLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ClienteDashboardPage />} />
        <Route path="perfil" element={<ClientePerfilPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Route>
  </Route>
);
