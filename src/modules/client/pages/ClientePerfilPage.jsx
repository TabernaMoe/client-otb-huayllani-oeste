import {
  UserCircleIcon,
  IdentificationIcon,
  PhoneIcon,
  MapPinIcon,
  UserGroupIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

import { AuthService } from '../../auth/services/auth.services';

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-black text-slate-900">
            {value || 'No registrado'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ClientePerfilPage() {
  const user = AuthService.getUser();

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-cyan-600 to-blue-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white/20 text-4xl font-black backdrop-blur">
            {user?.nombre_completo?.charAt(0) || 'U'}
          </div>

          <div>
            <p className="text-sm font-semibold text-cyan-100">
              Portal del socio
            </p>

            <h1 className="mt-1 text-3xl font-black">
              {user?.nombre_completo || 'Usuario'}
            </h1>

            <p className="mt-2 text-sm text-cyan-50">
              Rol: {user?.rol || 'usuario_normal'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard
          icon={IdentificationIcon}
          label="Cédula de identidad"
          value={`${user?.ci_socio || ''} ${user?.ci_expedido || ''}`}
        />

        <InfoCard
          icon={PhoneIcon}
          label="Número de celular"
          value={user?.numero_celular}
        />

        <InfoCard
          icon={UserGroupIcon}
          label="Género"
          value={user?.genero}
        />

        <InfoCard
          icon={MapPinIcon}
          label="Dirección"
          value={user?.direccion}
        />

        <InfoCard
          icon={HomeIcon}
          label="Acciones registradas"
          value={user?.acciones?.length || 0}
        />

        <InfoCard
          icon={UserCircleIcon}
          label="Estado"
          value="Activo"
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">
          Acciones del socio
        </h2>

        <div className="mt-4">
          {user?.acciones?.length > 0 ? (
            <div className="space-y-3">
              {user.acciones.map((accion, index) => (
                <div
                  key={accion.id || index}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <p className="font-bold text-slate-800">
                    Acción #{accion.id || index + 1}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No tiene acciones registradas.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}