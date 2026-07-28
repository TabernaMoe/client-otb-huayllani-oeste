import { Navigate, Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import PermissionRoute from './PermissionRoute';
import AdminRoute from './AdminRoute';
import ClienteRoute from './ClienteRoute';

import AdminLayout from '../layouts/AdminLayout';
import ClienteLayout from '../layouts/ClienteLayout';

// Panel administrativo
import AdminDashboardPage from '../modules/Admin/pages/AdminDashboardPage';
import AdminPage from '../modules/Admin/pages/AdminPage';
import ReportesPage from '../modules/Admin/pages/ReportesPage';

// Administración
import RolesPage from '../modules/roles/pages/RolesPage';
import GestionesPage from '../modules/gestiones/pages/GestionesPage';
import PeriodosPage from '../modules/periodo/pages/PeriodosPage';

// Socios y acciones
import SocioPage from '../modules/socios/pages/SocioPage';
import AccionesPage from '../modules/acciones/pages/AccionesPage';
import DetalleAccionPage from '../modules/detalleAccion/pages/DetalleAccionPage';
import CobrosPage from '../modules/cobros/pages/CobrosPage';

// Gestión de agua
import LecturasPage from '../modules/lecturas/pages/LecturasPage';
import CobrosAguaPage from '../modules/cobrosAgua/pages/CobrosAguaPage';
import TarifasPage from '../modules/tarifas/pages/TarifasPage';

// Organización
import CallesPage from '../modules/calles/pages/CallesPage';
import AsambleasPage from '../modules/asambleas/pages/AsambleasPage';

// Cliente
import ClientePerfilPage from '../modules/client/pages/ClientePerfilPage';
import ClienteDashboardPage from '../modules/client/pages/ClienteDashboardPage';
import ClienteAccionesPage from '../modules/client/pages/ClienteAccionesPage';

export const privateRoutes = (
  <Route element={<ProtectedRoute />}>
    {/* ====================================================== */}
    {/* RUTAS DEL PANEL ADMINISTRATIVO */}
    {/* ====================================================== */}

    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        {/* Al entrar a /admin, mostrar el dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Dashboard general: accesible para usuarios administrativos */}
        <Route
          path="dashboard"
          element={<AdminDashboardPage />}
        />

        {/* ================================================== */}
        {/* GESTIÓN DE USUARIOS */}
        {/* ================================================== */}

        <Route
          element={
            <PermissionRoute
              permission={[
                'usuario.ver',
                'usuarios.ver',
                'auth.usuario.ver',
              ]}
            />
          }
        >
          <Route
            path="usuarios"
            element={<AdminPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* ROLES Y PERMISOS */}
        {/* ================================================== */}

        <Route
          element={
            <PermissionRoute
              permission={[
                'rol.ver',
                'roles.ver',
                'auth.rol.ver',
              ]}
            />
          }
        >
          <Route
            path="roles"
            element={<RolesPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* GESTIONES */}
        {/* ================================================== */}

        <Route
          element={
            <PermissionRoute
              permission={[
                'gestion.ver',
                'gestiones.ver',
              ]}
            />
          }
        >
          <Route
            path="gestiones"
            element={<GestionesPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* PERIODOS */}
        {/* ================================================== */}

        <Route
          element={
            <PermissionRoute
              permission={[
                'periodo.ver',
                'periodos.ver',
                'gestion.ver',
                'gestiones.ver',
              ]}
            />
          }
        >
          <Route
            path="periodos"
            element={<PeriodosPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* ACCIONES */}
        {/* ================================================== */}

        <Route
          element={
            <PermissionRoute
              permission={[
                'acciones.accion.ver',
                'accion.ver',
                'acciones.ver',
              ]}
            />
          }
        >
          <Route
            path="acciones"
            element={<AccionesPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* SOCIOS */}
        {/* ================================================== */}

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
          <Route
            path="socios"
            element={<SocioPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* CALLES */}
        {/* ================================================== */}

        <Route
          element={
            <PermissionRoute
              permission={[
                'calle.ver',
                'calles.ver',
                'acciones.calles.ver',
              ]}
            />
          }
        >
          <Route
            path="calles"
            element={<CallesPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* TARIFAS */}
        {/* ================================================== */}

        <Route
          element={
            <PermissionRoute
              permission={[
                'tarifa.ver',
                'tarifas.ver',
              ]}
            />
          }
        >
          <Route
            path="tarifas"
            element={<TarifasPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* DETALLE DE PAGO DE ACCIÓN */}
        {/* ================================================== */}

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
          <Route
            path="detalle-pago-accion"
            element={<DetalleAccionPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* COBROS DE ACCIÓN */}
        {/* ================================================== */}

        <Route
          element={
            <PermissionRoute
              permission={[
                'cobro.ver',
                'cobros.ver',
                'pago.ver',
                'pagos.ver',
              ]}
            />
          }
        >
          <Route
            path="cobros"
            element={<CobrosPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* LECTURAS DE AGUA */}
        {/* ================================================== */}

        <Route
          element={
            <PermissionRoute
              permission={[
                'lectura.ver',
                'lecturas.ver',
                'agua.lectura.ver',
              ]}
            />
          }
        >
          <Route
            path="lecturas"
            element={<LecturasPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* COBROS DE AGUA */}
        {/* ================================================== */}

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
          <Route
            path="cobros-agua"
            element={<CobrosAguaPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* ASAMBLEAS */}
        {/* ================================================== */}

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
          <Route
            path="asambleas"
            element={<AsambleasPage />}
          />
        </Route>

        {/* ================================================== */}
        {/* REPORTES */}
        {/* ================================================== */}

        <Route
          element={
            <PermissionRoute
              permission={[
                'reporte.ver',
                'reportes.ver',
              ]}
            />
          }
        >
          <Route
            path="reportes"
            element={<ReportesPage />}
          />
        </Route>

        {/* Ruta administrativa no encontrada */}
        <Route
          path="*"
          element={<Navigate to="dashboard" replace />}
        />
      </Route>
    </Route>

    {/* ====================================================== */}
    {/* RUTAS DEL CLIENTE */}
    {/* ====================================================== */}

    <Route element={<ClienteRoute />}>
      <Route path="/cliente" element={<ClienteLayout />}>
        {/* Al entrar a /cliente, mostrar dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route
          path="dashboard"
          element={<ClienteDashboardPage />}
        />

        <Route
          path="perfil"
          element={<ClientePerfilPage />}
        />

        <Route
          path="acciones"
          element={<ClienteAccionesPage />}
        />

        {/* Ruta de cliente no encontrada */}
        <Route
          path="*"
          element={<Navigate to="dashboard" replace />}
        />
      </Route>
    </Route>
  </Route>
);