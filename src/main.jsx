import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import { ToastContainer } from 'react-toastify';

import AppRouter from './routes/AppRouter';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />

    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover={false}
      draggable
    />
  </StrictMode>,
);