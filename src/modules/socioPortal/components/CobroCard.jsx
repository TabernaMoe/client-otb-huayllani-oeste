import {
  BanknotesIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

import { formatCurrency, formatDate } from '../../../utils/formatters';

function getEstadoClasses(estado) {
  if (estado === 'PAGADO') return 'bg-emerald-100 text-emerald-700';
  if (estado === 'PARCIAL') return 'bg-amber-100 text-amber-700';
  if (estado === 'PENDIENTE') return 'bg-rose-100 text-rose-700';
  return 'bg-slate-100 text-slate-600';
}

export default function CobroCard({ cobro }) {
  const total = Number(cobro.monto_total ?? cobro.monto ?? 0);
  const pagado = Number(cobro.monto_pagado ?? 0);
  const saldo = Number(cobro.saldo ?? cobro.monto ?? 0);
  const porcentaje = total > 0 ? Math.min(100, Math.round((pagado / total) * 100)) : 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              {cobro.origen === 'AGUA' ? 'Consumo de agua' : cobro.tipo_cobro || 'General'}
            </p>
            <h3 className="mt-1 line-clamp-2 text-lg font-black text-slate-900">
              {cobro.concepto || 'Sin concepto'}
            </h3>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getEstadoClasses(
              cobro.estado,
            )}`}
          >
            {cobro.estado || 'Sin estado'}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3.5">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total</p>
            <p className="mt-0.5 text-sm font-black text-slate-800">
              {formatCurrency(total)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Saldo pendiente</p>
            <p
              className={`mt-0.5 text-sm font-black ${
                saldo > 0 ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {formatCurrency(saldo)}
            </p>
          </div>
        </div>

        {cobro.estado === 'PARCIAL' && (
          <div>
            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
              <span>Pagado: {formatCurrency(pagado)}</span>
              <span>{porcentaje}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
        )}

        <Dato
          icon={CalendarDaysIcon}
          label="Fecha de emisión"
          value={formatDate(cobro.fecha_emision)}
        />

        <Dato
          icon={DocumentTextIcon}
          label="Descripción"
          value={cobro.descripcion || 'Sin descripción'}
        />

        {cobro.estado === 'PAGADO' && (
          <Dato
            icon={BanknotesIcon}
            label="Pagado"
            value={formatCurrency(pagado || total)}
          />
        )}
      </div>
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
