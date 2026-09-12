import {
  IdentificationIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { AuthService } from '../../auth/services/auth.services';

function formatRole(role) {
  return role.replaceAll('_', ' ');
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-1 break-words text-lg font-black text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function ClientePerfilPage() {
  const user = AuthService.getUser();

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 to-cyan-700 p-6 text-white shadow-lg">
        <div className="flex items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/20 backdrop-blur">
            <UserCircleIcon className="h-12 w-12" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-100">
              Datos de acceso
            </p>
            <h1 className="mt-1 text-3xl font-black">
              {user.nombre_usuario}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard
          icon={IdentificationIcon}
          label="Nombre de usuario"
          value={user.nombre_usuario}
        />
        <InfoCard
          icon={ShieldCheckIcon}
          label="Rol"
          value={formatRole(user.rol)}
        />
      </div>
    </section>
  );
}
