import { BrowserRouter, Routes } from 'react-router-dom';

import { publicRoutes } from './public.routes';
import { privateRoutes } from './private.routes';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes}

        {privateRoutes}
      </Routes>
    </BrowserRouter>
  );
}