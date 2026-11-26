import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { getHomeRoute } from '../../modules/auth/utils/authRedirect';

export default function GuestRoute() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getHomeRoute(user)} replace />;
  }

  return <Outlet />;
}
