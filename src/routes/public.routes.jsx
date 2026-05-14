import { Route } from 'react-router-dom';

import LoginPage from '../modules/auth/pages/LoginPage';

export const publicRoutes = (
  <>
    <Route path="login" element={<LoginPage />} />
  </>
);