import {
  BoltIcon,
  MapPinIcon,
  TagIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function AccionCard({ accion }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50 to-cyan-50 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Acción
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-900">
              {accion.codigo_interno || 'Sin código'}
            </h3>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              accion.estado === 'ACTIVO'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {accion.estado || 'Sin estado'}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <Dato
          icon={TagIcon}
          label="Tipo"
          value={accion.tipo || 'Sin tipo'}
        />

        <Dato
          icon={BoltIcon}
          label="Medidor"
          value={accion.nro_medidor || 'Sin medidor'}
        />

        <Dato
          icon={MapPinIcon}
          label="Calle"
          value={accion.calle || 'Sin calle'}
        />

        <Dato
          icon={CurrencyDollarIcon}
          label="Tarifa"
          value={accion.tarifa || 'Sin tarifa'}
        />

        <Dato
          icon={CheckCircleIcon}
          label="Dirección"
          value={accion.direccion || 'Sin dirección'}
        />
      </div>
    </article>
  );
}

function Dato({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}