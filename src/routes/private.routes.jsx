/*import { Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';

import HomeLayout from '../layouts/AdminLayaout';
import ClienteLayout from '../layouts/ClienteLayaout';
import AdminLayout from '../layouts/AdminLayaout';

import SocioPage from '../modules/socios/pages/SocioPage';
//import PagoPage from '../modules/sociosAcciones/pages/socios/PagoPage';
import GestionAcciones from '../modules/acciones/pages/Tabs';
import AdminPage from '../modules/Admin/pages/AdminPage';
import AdminReportes from '../modules/Admin/pages/ReportesPage';

export const privateRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<HomeLayout />} />

      <Route path="/cliente" element={<ClienteLayout />}>
        <Route index element={<Navigate to="socios" replace />} />
        <Route path="socios" element={<SocioPage />} />
        <Route path="gestion-acciones" element={<GestionAcciones />} />
      </Route>

     <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Navigate to="usuarios" replace />} />
  <Route path="usuarios" element={<AdminPage />} />
  <Route path="socios" element={<SocioPage />} />
  <Route path="gestion-acciones" element={<GestionAcciones />} />
  <Route path="reportes" element={<AdminReportes />} />
</Route>
    </Route>
  </>
);*/




import { Navigate, Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import PermissionRoute from './PermissionRoute';

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
export const privateRoutes = (
  <Route element={<ProtectedRoute />}>
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

    <Route path="/cliente" element={<ClienteLayout />}>
      <Route index element={<Navigate to="socios" replace />} />
      <Route path="socios" element={<SocioPage />} />
      <Route path="gestion-acciones" element={<GestionAcciones />} />
    </Route>
  </Route>
);