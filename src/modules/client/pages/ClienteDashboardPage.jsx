import {
  BanknotesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';

import { AuthService } from '../../auth/services/auth.services';

import InfoCard from '../../../components/InfoCard';
import QuickActionCard from '../../../components/QuickActionCard';

function formatRole(role = '') {
  return role.replaceAll('_', ' ');
}

export default function ClienteDashboardPage() {
  const user = AuthService.getUser();

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 to-cyan-700 p-6 text-white shadow-lg sm:p-8">
        <p className="text-sm font-semibold text-emerald-100">
          Portal del socio
        </p>

        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          Bienvenido, {user.nombre_usuario}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50">
          Consulta tus acciones, lecturas, cobros y datos personales desde un solo lugar.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={UserCircleIcon}
          label="Usuario"
          value={user.nombre_usuario}
        />

        <InfoCard
          icon={ShieldCheckIcon}
          label="Rol"
          value={formatRole(user.rol)}
          iconClass="bg-cyan-50 text-cyan-700"
        />

        <InfoCard
          icon={CheckCircleIcon}
          label="Estado"
          value="Cuenta activa"
          iconClass="bg-emerald-50 text-emerald-700"
        />
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-black text-slate-900">
            Accesos rápidos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ingresa rápidamente a las opciones más utilizadas.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickActionCard
            title="Mis acciones"
            description="Consulta las acciones asociadas a tu cuenta."
            to="/cliente/acciones"
            icon={CheckCircleIcon}
          />

          <QuickActionCard
            title="Mis lecturas"
            description="Consulta tus lecturas y consumos."
            to="/cliente/lecturas"
            icon={ChartBarIcon}
          />

          <QuickActionCard
            title="Mis cobros"
            description="Revisa cobros pendientes y pagados."
            to="/cliente/cobros"
            icon={BanknotesIcon}
          />

          <QuickActionCard
            title="Mi perfil"
            description="Consulta tus datos personales."
            to="/cliente/perfil"
            icon={UserCircleIcon}
          />
        </div>
      </div>
    </section>
  );
}