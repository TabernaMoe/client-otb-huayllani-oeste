import { Route, Navigate } from 'react-router-dom';

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
        <Route path="reportes" element={<AdminReportes />} />
      </Route>
    </Route>
  </>
);