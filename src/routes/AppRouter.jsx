import { BrowserRouter, Routes } from 'react-router-dom';

import ErrorBoundary from '../components/ErrorBoundary';
import { AuthProvider } from '../modules/auth/context/AuthContext';
import { publicRoutes } from './public.routes';
import { privateRoutes } from './private.routes';

export default function AppRouter() {
  return (
    <ErrorBoundary fullScreen>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {publicRoutes}
            {privateRoutes}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}