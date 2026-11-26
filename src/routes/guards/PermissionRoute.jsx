import { Outlet } from 'react-router-dom';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../modules/auth/context/AuthContext';

export default function PermissionRoute({ permission }) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <ShieldExclamationIcon className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Acceso denegado</h2>
        <p className="mt-2 text-sm text-slate-500">
          No tienes permiso para acceder a este módulo.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
