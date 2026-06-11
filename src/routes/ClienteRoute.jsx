import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../modules/auth/services/auth.services';

export default function ClienteRoute() {
  const role = String(AuthService.getRole() || '').toLowerCase().trim();

  if (role !== 'usuario_normal') {
    return <Navigate to="/admin/usuarios" replace />;
  }

  return <Outlet />;
}