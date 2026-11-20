import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

import { formatCurrency } from '../../../utils/formatters';

export default function LecturaCard({ lectura }) {
  const mora = Number(lectura.mora ?? 0);

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-b border-slate-100 bg-linear-to-r from-cyan-50 to-emerald-50 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">
              Periodo de lectura
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

      <div className="space-y-3 p-5">
        <div className="grid grid-cols-2 gap-3">
          <Dato
            icon={ChartBarIcon}
            label="Anterior"
            value={`${lectura.lectura_anterior ?? 0} m³`}
          />
          <Dato
            icon={ArrowTrendingUpIcon}
            label="Actual"
            value={`${lectura.lectura_actual ?? 0} m³`}
          />
          <Dato
            icon={ChartBarIcon}
            label="Consumo"
            value={`${lectura.consumo_m3 ?? 0} m³`}
            highlight="text-cyan-800"
          />
          <Dato
            icon={BanknotesIcon}
            label="Total"
            value={formatCurrency(lectura.monto)}
            highlight="text-emerald-700"
          />
        </div>

        {mora > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-3.5 py-2.5 text-xs font-bold text-amber-800">
            <span className="inline-flex items-center gap-1.5">
              <ExclamationTriangleIcon className="h-4 w-4" />
              Incluye mora
            </span>
            <span>{formatCurrency(mora)}</span>
          </div>
        )}
      </div>
    </article>
  );
}

function Dato({ icon: Icon, label, value, highlight = 'text-slate-900' }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3.5">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className={`mt-1.5 text-base font-black ${highlight}`}>{value}</p>
    </div>
  );
}
