import { lazy, Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

import ProtectedRoute from './guards/ProtectedRoute';
import PermissionRoute from './guards/PermissionRoute';
import AccountTypeRoute from './guards/AccountTypeRoute';
import { PERMS } from './permissions';
import PageLoader from '../components/PageLoader';

import AdminLayout from '../layouts/AdminLayout';
import SocioLayout from '../layouts/SocioLayout';

// Admin pages (lazy)
const AdminDashboardPage = lazy(() => import('../modules/Admin/pages/AdminDashboardPage'));
const AdminPage = lazy(() => import('../modules/Admin/pages/AdminPage'));
const ReportesPage = lazy(() => import('../modules/reportes/pages/ReportesHubPage'));
const RolesPage = lazy(() => import('../modules/roles/pages/RolesPage'));
const GestionesPage = lazy(() => import('../modules/gestiones/pages/GestionesPage'));
const PeriodosPage = lazy(() => import('../modules/periodo/pages/PeriodosPage'));
const SocioPage = lazy(() => import('../modules/socios/pages/SocioPage'));
const AccionesPage = lazy(() => import('../modules/acciones/pages/AccionesPage'));
const DetalleAccionPage = lazy(() => import('../modules/detalleAccion/pages/DetalleAccionPage'));
const CobrosPage = lazy(() => import('../modules/cobros/pages/CobrosPage'));
const AlcantarilladoPage = lazy(() => import('../modules/alcantarillado/pages/AlcantarilladoPage'));
const AccionesAlcantarilladoPage = lazy(() => import('../modules/alcantarillado/pages/AccionesAlcantarilladoPage'));
const CambioNombrePage = lazy(() => import('../modules/cambioNombre/pages/CambioNombrePage'));
const LecturasPage = lazy(() => import('../modules/lecturas/pages/LecturasPage'));
const TarifasPage = lazy(() => import('../modules/tarifas/pages/TarifasPage'));
const CallesPage = lazy(() => import('../modules/calles/pages/CallesPage'));
const AsambleasPage = lazy(() => import('../modules/asambleas/pages/AsambleasPage'));
const TipoAccionPage = lazy(() => import('../modules/tipoAccion/pages/TipoAccionPage'));
const InventarioPage = lazy(() => import('../modules/inventario/pages/InventarioPage'));
const MultasPage = lazy(() => import('../modules/multas/pages/MultasPage'));
const AdelantoPagosPage = lazy(() => import('../modules/adelantoPagos/pages/AdelantoPagosPage'));
const EgresosPage = lazy(() => import('../modules/egresos/pages/EgresosPage'));
const CobroUniversalDosPage = lazy(() => import('../modules/reciboUniversal/page/cobroUniversalPage'));
const RecibosByAccionPage = lazy(() => import('../modules/reportes/recibos/recibosByAccion/RecibosByAccionPage'));

// Socio portal pages (lazy)
const SocioDashboardPage = lazy(() => import('../modules/socioPortal/pages/SocioDashboardPage'));
const MisAccionesPage = lazy(() => import('../modules/socioPortal/pages/MisAccionesPage'));
const MisLecturasPage = lazy(() => import('../modules/socioPortal/pages/MisLecturasPage'));
const MisCobrosPage = lazy(() => import('../modules/socioPortal/pages/MisCobrosPage'));
const MisRecibosPage = lazy(() => import('../modules/socioPortal/pages/MisRecibosPage'));
const MiPerfilPage = lazy(() => import('../modules/socioPortal/pages/MiPerfilPage'));
const CambiarContrasenaPage = lazy(() => import('../modules/socioPortal/pages/CambiarContrasenaPage'));

const load = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const guard = (codes) => <PermissionRoute permission={codes} />;

export const privateRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<AccountTypeRoute allowed={['ADMIN']} />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={load(AdminDashboardPage)} />

        <Route element={guard(PERMS.USUARIOS)}>
          <Route path="usuarios" element={load(AdminPage)} />
        </Route>

        <Route element={guard(PERMS.ROLES)}>
          <Route path="roles" element={load(RolesPage)} />
        </Route>

        <Route element={guard(PERMS.GESTIONES)}>
          <Route path="gestiones" element={load(GestionesPage)} />
        </Route>

        <Route element={guard(PERMS.PERIODOS)}>
          <Route path="periodos" element={load(PeriodosPage)} />
        </Route>

        <Route element={guard(PERMS.ACCIONES)}>
          <Route path="acciones" element={load(AccionesPage)} />
          <Route path="acciones/adelantos" element={load(AdelantoPagosPage)} />
          <Route path="alcantarillado" element={load(AlcantarilladoPage)} />
          <Route path="alcantarillado/acciones" element={load(AccionesAlcantarilladoPage)} />
          <Route path="cambio-nombre" element={load(CambioNombrePage)} />
          <Route path="tipo-accion" element={load(TipoAccionPage)} />
        </Route>

        <Route element={guard(PERMS.DETALLE_ACCION)}>
          <Route path="detalle-pago-accion" element={load(DetalleAccionPage)} />
        </Route>

        <Route element={guard(PERMS.SOCIOS)}>
          <Route path="socios" element={load(SocioPage)} />
        </Route>

        <Route element={guard(PERMS.CALLES)}>
          <Route path="calles" element={load(CallesPage)} />
        </Route>

        <Route element={guard(PERMS.TARIFAS)}>
          <Route path="tarifas" element={load(TarifasPage)} />
        </Route>

        <Route element={guard(PERMS.MULTAS)}>
          <Route path="multas" element={load(MultasPage)} />
        </Route>

        <Route element={guard(PERMS.COBROS)}>
          <Route path="cobros" element={load(CobrosPage)} />
          <Route path="cobro-universal-dos" element={load(CobroUniversalDosPage)} />
        </Route>

        <Route element={guard(PERMS.LECTURAS)}>
          <Route path="lecturas" element={load(LecturasPage)} />
        </Route>

        <Route element={guard(PERMS.ASAMBLEAS)}>
          <Route path="asambleas" element={load(AsambleasPage)} />
        </Route>

        <Route element={guard(PERMS.EGRESOS)}>
          <Route path="egresos" element={load(EgresosPage)} />
        </Route>

        <Route element={guard(PERMS.REPORTES)}>
          <Route path="reportes" element={load(ReportesPage)} />
          <Route path="reportes-recibo-accion" element={load(RecibosByAccionPage)} />
        </Route>

        <Route element={guard(PERMS.INVENTARIO)}>
          <Route path="inventario" element={load(InventarioPage)} />
        </Route>

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Route>

    <Route element={<AccountTypeRoute allowed={['SOCIO']} />}>
      <Route path="/socio" element={<SocioLayout />}>
        <Route index element={<Navigate to="inicio" replace />} />
        <Route path="inicio" element={load(SocioDashboardPage)} />
        <Route path="acciones" element={load(MisAccionesPage)} />
        <Route path="lecturas" element={load(MisLecturasPage)} />
        <Route path="cobros" element={load(MisCobrosPage)} />
        <Route path="recibos" element={load(MisRecibosPage)} />
        <Route path="perfil" element={load(MiPerfilPage)} />
        <Route path="cambiar-contrasena" element={load(CambiarContrasenaPage)} />
        <Route path="*" element={<Navigate to="inicio" replace />} />
      </Route>
    </Route>

    <Route path="/cliente/*" element={<Navigate to="/socio/inicio" replace />} />
  </Route>
);