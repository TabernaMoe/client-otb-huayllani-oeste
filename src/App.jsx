import LoginPage from './modules/auth/pages/LoginPage';
import HomeLayaout from './layouts/HomeLayaout';
import ClienteLayaout from './layouts/ClienteLayaout';
import { BrowserRouter, Route, Routes } from 'react-router';

import SocioPage from './modules/sociosAcciones/pages/socios/SocioPage';
import PagoPage from './modules/sociosAcciones/pages/socios/PagoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomeLayaout />} />
        <Route path="cliente" element={<ClienteLayaout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="socios" element={<SocioPage />} />
          <Route path="pagos" element={<PagoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
