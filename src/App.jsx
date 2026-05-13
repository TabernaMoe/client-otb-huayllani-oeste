import LoginPage from './modules/auth/pages/LoginPage';
import HomeLayaout from './layouts/HomeLayaout';
import ClienteLayaout from './layouts/ClienteLayaout';
import { BrowserRouter, Route, Routes } from 'react-router';

import TabSocio from './modules/socios/pages/TabSocio';
import GestionAcciones from './modules/acciones/pages/Tabs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomeLayaout />} />
        <Route path="cliente" element={<ClienteLayaout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="socios" element={<TabSocio />} />
          <Route path="gestion-acciones" element={<GestionAcciones />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
