import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CreditCardIcon,
  HashtagIcon,
  MapPinIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

import { AuthService } from '../../auth/services/auth.services';

function formatMoney(value) {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(Number(value || 0));
}

function ActionCard({ accion, index }) {
  const estado = accion?.estado || accion?.estado_accion || 'ACTIVA';

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-100 blur-2xl transition group-hover:bg-cyan-200" />
      <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-blue-100 blur-2xl transition group-hover:bg-blue-200" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-700 text-white shadow-lg">
              <BuildingOffice2Icon className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Acción del socio
              </p>
              <h3 className="text-2xl font-black text-slate-900">
                #{accion?.numero_accion || accion?.codigo_accion || index + 1}
              </h3>
            </div>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            {estado}
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <HashtagIcon className="h-5 w-5 text-cyan-700" />
            <div>
              <p className="text-xs font-semibold text-slate-500">Código</p>
              <p className="text-sm font-bold text-slate-800">
                {accion?.codigo_accion || accion?.id || 'Sin código'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <CreditCardIcon className="h-5 w-5 text-cyan-700" />
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Monto de acción
              </p>
              <p className="text-sm font-bold text-slate-800">
                {formatMoney(
                  accion?.monto ||
                    accion?.precio ||
                    accion?.monto_accion ||
                    accion?.costo,
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <CalendarDaysIcon className="h-5 w-5 text-cyan-700" />
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Fecha de compra
              </p>
              <p className="text-sm font-bold text-slate-800">
                {accion?.fecha_compra
                  ? String(accion.fecha_compra).slice(0, 10)
                  : 'No registrada'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <MapPinIcon className="h-5 w-5 text-cyan-700" />
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Ubicación / referencia
              </p>
              <p className="text-sm font-bold text-slate-800">
                {accion?.ubicacion || accion?.direccion || 'Sin referencia'}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700"
        >
          <SparklesIcon className="h-5 w-5" />
          Ver detalle de acción
        </button>
      </div>
    </article>
  );
}

export default function ClienteAccionesPage() {
  const user = AuthService.getUser();

  const acciones = user?.acciones || [];

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-cyan-600 to-blue-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-cyan-100">Mis acciones</p>
            <h1 className="mt-2 text-3xl font-black">
              Acciones registradas en la OTB
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50">
              Aquí puedes ver las acciones que tienes registradas o compradas
              dentro de la OTB Huayllani Oeste.
            </p>
          </div>

          <div className="rounded-3xl bg-white/15 p-5 text-center backdrop-blur">
            <p className="text-sm text-cyan-100">Total acciones</p>
            <p className="text-4xl font-black">{acciones.length}</p>
          </div>
        </div>
      </div>

      {acciones.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <CheckCircleIcon className="mx-auto h-14 w-14 text-slate-300" />
          <h2 className="mt-4 text-xl font-black text-slate-800">
            No tienes acciones registradas
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Cuando se registre o compre una acción, aparecerá en esta sección.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {acciones.map((accion, index) => (
            <ActionCard
              key={accion?.id || accion?.codigo_accion || index}
              accion={accion}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}