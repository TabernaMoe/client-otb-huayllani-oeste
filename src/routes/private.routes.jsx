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
import RolesPage from '../modules/roles/pages/RolesPage';
import GestionesPage from '../modules/gestiones/pages/GestionesPage';
import CallesPage from '../modules/calles/pages/CallesPage';
import TarifasPage from '../modules/tarifas/pages/TarifasPage';
import DetalleAccionPage from '../modules/detalleAccion/pages/DetalleAccionPage';
import PeriodosPage from '../modules/periodo/pages/PeriodosPage';
import AccionesPage from '../modules/acciones/pages/AccionesPage';
import CobrosPage from '../modules/cobros/pages/CobrosPage';
import LecturasPage from '../modules/lecturas/pages/LecturasPage';
import CobrosAguaPage from '../modules/cobrosAgua/pages/CobrosAguaPage';
import AsambleasPage from '../modules/asambleas/pages/AsambleasPage';



import ClientePerfilPage from '../modules/client/pages/ClientePerfilPage';
import ClienteDashboardPage from '../modules/client/pages/ClienteDashboardPage';
import ClienteAccionesPage from '../modules/client/pages/ClienteAccionesPage';

export const privateRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        {/* IMPORTANTE: no mandar siempre a usuarios */}
        <Route index element={<Navigate to="acciones" replace />} />
<Route
  element={
    <PermissionRoute
      permission={['lectura.ver', 'lecturas.ver', 'agua.lectura.ver']}
    />
  }
>
  <Route path="lecturas" element={<LecturasPage />} />
</Route>
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
              permission={['rol.ver', 'roles.ver', 'auth.rol.ver']}
            />
          }
        >
          <Route path="roles" element={<RolesPage />} />
        </Route>
<Route
  element={
    <PermissionRoute
      permission={[
        'pago_agua.ver',
        'pago-agua.ver',
        'cobro_agua.ver',
        'cobros_agua.ver',
        'agua.cobro.ver',
      ]}
    />
  }
>
  <Route path="cobros-agua" element={<CobrosAguaPage />} />
</Route>
<Route
  element={
    <PermissionRoute
      permission={[
        'asamblea.ver',
        'asambleas.ver',
        'reunion.ver',
        'reuniones.ver',
      ]}
    />
  }
>
  <Route path="asambleas" element={<AsambleasPage />} />
</Route>
        <Route
          element={
            <PermissionRoute permission={['gestion.ver', 'gestiones.ver']} />
          }
        >
          <Route path="gestiones" element={<GestionesPage />} />
          <Route path="periodos" element={<PeriodosPage />} />
        </Route>

        <Route
          element={
            <PermissionRoute
              permission={['acciones.accion.ver', 'accion.ver', 'acciones.ver']}
            />
          }
        >
          <Route path="acciones" element={<AccionesPage />} />
        </Route>

        <Route
          element={
            <PermissionRoute
              permission={[
                'socio.ver',
                'socios.ver',
                'socios.socio.ver',
              ]}
            />
          }
        >
          <Route path="socios" element={<SocioPage />} />
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
            <PermissionRoute
              permission={[
                'acciones.detalle.ver',
                'acciones.detalles.ver',
                'detalle_accion.ver',
                'detalle_pago_accion.ver',
              ]}
            />
          }
        >
          <Route path="detalle-pago-accion" element={<DetalleAccionPage />} />
        </Route>

        <Route
          element={
            <PermissionRoute
              permission={['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver']}
            />
          }
        >
          <Route path="cobros" element={<CobrosPage />} />
        </Route>

        <Route
          element={
            <PermissionRoute permission={['reporte.ver', 'reportes.ver']} />
          }
        >
          <Route path="reportes" element={<ReportesPage />} />
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