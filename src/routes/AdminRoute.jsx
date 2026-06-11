import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../modules/auth/services/auth.services';

export default function AdminRoute() {
  const role = String(AuthService.getRole() || '').toLowerCase().trim();

  if (role === 'usuario_normal') {
    return <Navigate to="/cliente/dashboard" replace />;
  }

  return <Outlet />;
}