import { Route } from 'react-router-dom';

import LoginPage from '../modules/auth/page/LoginPage';
import InicioLayout from '../layouts/InicioLayout'

export const publicRoutes = (
  <>
     <Route path='/' element={<InicioLayout/>}/>
    <Route path="login" element={<LoginPage />} />

  </>
);