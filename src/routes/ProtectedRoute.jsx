import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../modules/auth/services/auth.services';

export default function ProtectedRoute() {
  const token = AuthService.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}