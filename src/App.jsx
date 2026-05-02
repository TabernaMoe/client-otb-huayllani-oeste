import LoginPage from './modules/auth/pages/LoginPage';
import HomeLayaout from './layouts/HomeLayaout';
import ClienteLayaout from './layouts/ClienteLayaout';
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomeLayaout />} />
        <Route path="cliente" element={<ClienteLayaout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
