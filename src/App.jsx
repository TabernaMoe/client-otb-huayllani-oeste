import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './modules/auth/pages/LoginPage';
import HomeLayout from './layouts/HomeLayaout';
import ClienteLayout from './layouts/ClienteLayaout';

import SocioPage from './modules/sociosAcciones/pages/socios/SocioPage';
import PagoPage from './modules/sociosAcciones/pages/socios/PagoPage';
import GestionAcciones from './modules/acciones/pages/Tabs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta principal */}
        <Route path="/" element={<HomeLayout />} />

        {/* Rutas del sistema */}
        <Route path="/cliente" element={<ClienteLayout />}>
          <Route index element={<Navigate to="socios" replace />} />
          <Route path="socios" element={<SocioPage />} />
          <Route path="pagos" element={<PagoPage />} />
          <Route path="gestion-acciones" element={<GestionAcciones />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;