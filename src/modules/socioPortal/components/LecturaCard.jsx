import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

function formatMonto(value) {
  return `Bs ${Number(value ?? 0).toFixed(2)}`;
}

export default function LecturaCard({ lectura }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-b border-slate-100 bg-linear-to-r from-cyan-50 to-emerald-50 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">
              Periodo
            </p>
            <h3 className="mt-1 text-xl font-black text-slate-900">
              {lectura.mes || 'Sin mes'} {lectura.gestion ?? ''}
            </h3>
          </div>

          <div className="rounded-2xl bg-white p-2.5 text-cyan-700 shadow-sm">
            <CalendarDaysIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2">
        <Dato
          icon={ChartBarIcon}
          label="Lectura anterior"
          value={`${lectura.lectura_anterior ?? 0} m³`}
        />

        <Dato
          icon={ArrowTrendingUpIcon}
          label="Lectura actual"
          value={`${lectura.lectura_actual ?? 0} m³`}
        />

        <Dato
          icon={ChartBarIcon}
          label="Consumo"
          value={`${lectura.consumo_m3 ?? 0} m³`}
        />

        <Dato
          icon={BanknotesIcon}
          label="Monto"
          value={formatMonto(lectura.monto)}
        />
      </div>
    </article>
  );
}

function Dato({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 text-base font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}
