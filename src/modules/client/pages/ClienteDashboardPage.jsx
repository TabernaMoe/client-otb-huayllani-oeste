import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { AuthService } from '../../auth/services/auth.services';

function formatRole(role) {
  return role.replaceAll('_', ' ');
}

export default function ClienteDashboardPage() {
  const user = AuthService.getUser();

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 to-cyan-700 p-6 text-white shadow-lg sm:p-8">
        <p className="text-sm font-semibold text-emerald-100">
          Portal del socio
        </p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          Bienvenido, {user.nombre_usuario}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50">
          Desde aquí puedes revisar la información disponible para tu cuenta.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <UserCircleIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-500">Usuario</p>
              <p className="mt-1 truncate text-xl font-black text-slate-900">
                {user.nombre_usuario}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
              <ShieldCheckIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Rol</p>
              <p className="mt-1 text-xl font-black capitalize text-slate-900">
                {formatRole(user.rol)}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <CheckCircleIcon className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Cuenta activa
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Revisa los datos de acceso asociados a tu sesión.
              </p>
            </div>
          </div>

          <Link
            to="/cliente/perfil"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            Ver mi perfil
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
