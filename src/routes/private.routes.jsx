import { Navigate, Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import PermissionRoute from './PermissionRoute';
import AdminRoute from './AdminRoute';
import ClienteRoute from './ClienteRoute';

import AdminLayout from '../layouts/AdminLayout';
import ClienteLayout from '../layouts/ClienteLayout';

import AdminPage from '../modules/Admin/pages/AdminPage';
import ReportesPage from '../modules/Admin/pages/ReportesPage';
import SocioPage from '../modules/socios/pages/SocioPage';
//import GestionAcciones from '../modules/acciones/pages/Tabs';
import RolesPage from '../modules/roles/pages/RolesPage';
import GestionesPage from '../modules/gestiones/pages/GestionesPage';
import CallesPage from '../modules/calles/pages/CallesPage';
import TarifasPage from '../modules/tarifas/pages/TarifasPage';
import DetalleAccionPage from '../modules/detalleAccion/pages/DetalleAccionPage';
import PeriodosPage from '../modules/periodo/pages/PeriodosPage';
import AccionesPage from '../modules/acciones/pages/AccionesPage';
import CobrosPage from '../modules/cobros/pages/CobrosPage';

import ClientePerfilPage from '../modules/client/pages/ClientePerfilPage';
import ClienteDashboardPage from '../modules/client/pages/ClienteDashboardPage';
import ClienteAccionesPage from '../modules/client/pages/ClienteAccionesPage';

export const privateRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="usuarios" replace />} />

        <Route
          element={
            <PermissionRoute
              permission={['usuario.ver', 'usuarios.ver', 'auth.usuario.ver']}
            />
          }
        >
          <Route path="usuarios" element={<AdminPage />} />
        </Route>

        <Route
          element={
            <PermissionRoute
              permission={['socio.ver', 'socios.ver', 'socios.socio.ver']}
            />
          }
        >
          <Route path="socios" element={<SocioPage />} />
        </Route>

      

        <Route
          element={
            <PermissionRoute
              permission={['rol.ver', 'roles.ver', 'auth.rol.ver']}
            />
          }
        >
          <Route path="roles" element={<RolesPage />} />
        </Route>

        <Route
          element={
            <PermissionRoute permission={['gestion.ver', 'gestiones.ver']} />
          }
        >
          <Route path="gestiones" element={<GestionesPage />} />
        </Route>

        <Route
          element={
            <PermissionRoute permission={['gestion.ver', 'gestiones.ver']} />
          }
        >
          <Route path="periodos" element={<PeriodosPage />} />
        </Route>

        <Route
          element={
            <PermissionRoute
              permission={['calle.ver', 'calles.ver', 'acciones.calles.ver']}
            />
          }
        >
          <Route path="calles" element={<CallesPage />} />
        </Route>

        <Route
          element={
            <PermissionRoute permission={['tarifa.ver', 'tarifas.ver']} />
          }
        >
          <Route path="tarifas" element={<TarifasPage />} />
        </Route>

        <Route
          element={
            <PermissionRoute permission={['reporte.ver', 'reportes.ver']} />
          }
        >
          <Route path="reportes" element={<ReportesPage />} />
        </Route>
        <Route element={<PermissionRoute permission={['cobro.ver', 'cobros.ver']} />}>
  <Route path="cobros" element={<CobrosPage />} />
</Route>

        <Route
          element={
            <PermissionRoute
              permission={[
                'detalle_accion.ver',
                'detalle_pago_accion.ver',
                'acciones.detalles.ver',
              ]}
            />
          }
        >
          <Route
  element={
    <PermissionRoute
      permission={['acciones.ver', 'accion.ver', 'acciones.accion.ver']}
    />
  }
>
  <Route path="acciones" element={<AccionesPage />} />
</Route>
          <Route path="detalle-pago-accion" element={<DetalleAccionPage />} />
        </Route>
      </Route>
    </Route>

    <Route element={<ClienteRoute />}>
      <Route path="/cliente" element={<ClienteLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ClienteDashboardPage />} />
        <Route path="perfil" element={<ClientePerfilPage />} />
        <Route path="acciones" element={<ClienteAccionesPage />} />
      </Route>
    </Route>
  </Route>
);