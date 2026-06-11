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
import GestionAcciones from '../modules/acciones/pages/Tabs';
import RolesPage from '../modules/roles/pages/RolesPage';
import GestionesPage from '../modules/gestiones/pages/GestionesPage';
import CallesPage from '../modules/calles/pages/CallesPage';
import TarifasPage from '../modules/tarifas/pages/TarifasPage';
import DetalleAccionPage from '../modules/detalleAccion/pages/DetalleAccionPage';
import PeriodosPage from '../modules/periodo/pages/PeriodosPage';

import ClientePerfilPage from '../modules/client/pages/ClientePerfilPage';
import ClienteDashboardPage from '../modules/client/pages/ClienteDashboardPage';

export const privateRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="usuarios" replace />} />

        <Route element={<PermissionRoute permission="USUARIOS_READ" />}>
          <Route path="usuarios" element={<AdminPage />} />
        </Route>

        <Route element={<PermissionRoute permission="SOCIOS_READ" />}>
          <Route path="socios" element={<SocioPage />} />
        </Route>

        <Route element={<PermissionRoute permission="ACCIONES_READ" />}>
          <Route path="gestion-acciones" element={<GestionAcciones />} />
        </Route>

        <Route element={<PermissionRoute permission="ROLES_READ" />}>
          <Route path="roles" element={<RolesPage />} />
        </Route>

        <Route element={<PermissionRoute permission="GESTIONES_READ" />}>
          <Route path="gestiones" element={<GestionesPage />} />
        </Route>
        <Route element={<PermissionRoute permission="PERIODOS_READ" />}>
  <Route path="periodos" element={<PeriodosPage />} />
</Route>
        <Route element={<PermissionRoute permission="CALLES_READ" />}>
          <Route path="calles" element={<CallesPage />} />
        </Route>

        <Route element={<PermissionRoute permission="TARIFAS_READ" />}>
          <Route path="tarifas" element={<TarifasPage />} />
        </Route>

        <Route element={<PermissionRoute permission="REPORTES_READ" />}>
          <Route path="reportes" element={<ReportesPage />} />
        </Route>

        <Route element={<PermissionRoute permission="DETALLE_ACCION_READ" />}>
          <Route path="detalle-pago-accion" element={<DetalleAccionPage />} />
        </Route>
      </Route>
    </Route>

    <Route element={<ClienteRoute />}>
      <Route path="/cliente" element={<ClienteLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ClienteDashboardPage />} />
        <Route path="perfil" element={<ClientePerfilPage />} />
      </Route>
    </Route>
  </Route>
);