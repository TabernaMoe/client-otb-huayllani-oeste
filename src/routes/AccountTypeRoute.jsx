import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../modules/auth/services/auth.services';
import { getHomeRoute } from '../modules/auth/utils/authRedirect';

export default function AccountTypeRoute({ allowed }) {
  const user = AuthService.getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.tipo_usuario)) {
    return <Navigate to={getHomeRoute(user)} replace />;
  }

  return <Outlet />;
}
