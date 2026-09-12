import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../modules/auth/services/auth.services';

export default function ClienteRoute() {
  if (AuthService.getRole() !== 'usuario_normal') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
