import {
  BanknotesIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

import {
  formatCurrency,
  formatDate,
} from '../../../utils/formatters';

function getEstadoClasses(estado) {
  if (estado === 'PAGADO') {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (estado === 'PARCIAL') {
    return 'bg-amber-100 text-amber-700';
  }

  if (estado === 'PENDIENTE') {
    return 'bg-rose-100 text-rose-700';
  }

  return 'bg-slate-100 text-slate-600';
}

export default function CobroCard({ cobro }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              {cobro.origen || cobro.tipo_cobro || 'Cobro'}
            </p>

            <h3 className="mt-1 line-clamp-2 text-lg font-black text-slate-900">
              {cobro.concepto || 'Sin concepto'}
            </h3>
          </div>

          <span
            className={[
              'shrink-0 rounded-full px-3 py-1 text-xs font-bold',
              getEstadoClasses(cobro.estado),
            ].join(' ')}
          >
            {cobro.estado || 'Sin estado'}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <Dato
          icon={CalendarDaysIcon}
          label="Fecha"
          value={formatDate(cobro.fecha_emision)}
        />

        <Dato
          icon={BanknotesIcon}
          label="Saldo"
          value={formatCurrency(cobro.monto)}
        />

        <Dato
          icon={DocumentTextIcon}
          label="Descripción"
          value={cobro.descripcion || 'Sin descripción'}
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
        <p className="mt-1 break-words font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}
