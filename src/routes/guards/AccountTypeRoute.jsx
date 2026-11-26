import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { getHomeRoute } from '../../modules/auth/utils/authRedirect';

export default function AccountTypeRoute({ allowed }) {
  const { user, hasAccountType } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccountType(allowed)) {
    return <Navigate to={getHomeRoute(user)} replace />;
  }

  return <Outlet />;
}
