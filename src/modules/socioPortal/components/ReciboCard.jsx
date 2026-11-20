import {
  BanknotesIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  DocumentTextIcon,
  EyeIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';

import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function ReciboCard({ recibo, onSelect }) {
  const accionLabel = recibo.codigo_interno
    ? `#${recibo.codigo_interno}`
    : recibo.accion_id
      ? `#${recibo.accion_id}`
      : 'Sin acción';

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-b border-slate-100 bg-linear-to-r from-violet-50 to-cyan-50 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
              Recibo
            </p>
            <h3 className="mt-1 text-xl font-black text-slate-900">
              #{recibo.numero_recibo || recibo.id}
            </h3>
          </div>

          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
            {recibo.origen || 'RECIBO'}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3.5 p-5">
        <Dato
          icon={CalendarDaysIcon}
          label="Fecha"
          value={formatDate(recibo.fecha_emision)}
        />
        <Dato
          icon={BanknotesIcon}
          label="Monto pagado"
          value={formatCurrency(recibo.monto)}
        />
        <Dato
          icon={CreditCardIcon}
          label="Método"
          value={recibo.metodo_pago || 'EFECTIVO'}
        />
        <Dato
          icon={DocumentTextIcon}
          label="Concepto"
          value={recibo.concepto || 'Sin concepto'}
        />
        <Dato
          icon={ReceiptPercentIcon}
          label="Acción"
          value={accionLabel}
        />
      </div>

      {onSelect && (
        <div className="border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={() => onSelect(recibo)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-emerald-700 hover:text-white"
          >
            <EyeIcon className="h-4 w-4" />
            Ver comprobante
          </button>
        </div>
      )}
    </article>
  );
}

function Dato({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}
