import { Route } from 'react-router-dom';

import GuestRoute from './guards/GuestRoute';
import LoginPage from '../modules/auth/pages/LoginPage';
import InicioLayout from '../layouts/InicioLayout';

export const publicRoutes = (
  <>
    <Route path="/" element={<InicioLayout />} />
    <Route element={<GuestRoute />}>
      <Route path="login" element={<LoginPage />} />
    </Route>
  </>
);