import { Outlet } from 'react-router-dom';
import { AuthService } from '../modules/auth/services/auth.services';

export default function PermissionRoute({ permission }) {
  const hasPermission = AuthService.hasPermission(permission);

  if (!hasPermission) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Acceso denegado</h2>
        <p className="mt-2 text-sm text-slate-500">
          No tienes permiso para acceder a este módulo.
        </p>
      </div>
    );
  }

  return <Outlet />;
}