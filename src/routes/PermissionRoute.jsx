import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../modules/auth/services/auth.services';

export default function PermissionRoute({ permission }) {
  const hasPermission = AuthService.hasPermission(permission);

  if (!hasPermission) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}