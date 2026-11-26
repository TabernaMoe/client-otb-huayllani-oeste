import { formatCurrency } from '../../../utils/formatters';

export default function ReporteResumenCards({ rows = [], mode = 'cobros', totalItems = 0 }) {
  const totalMonto = rows.reduce(
    (acc, row) => acc + Number(row.monto_pagar || 0),
    0,
  );
  const totalPagado = rows.reduce(
    (acc, row) => acc + Number(row.monto_pagado || 0),
    0,
  );

  const cards =
    mode === 'cobros'
      ? [
          { label: 'Registros encontrados', value: totalItems, accent: 'text-slate-900' },
          { label: 'Total cobros (vista)', value: formatCurrency(totalMonto), accent: 'text-blue-700' },
        ]
      : [
          { label: 'Recibos encontrados', value: totalItems, accent: 'text-slate-900' },
          { label: 'Total recaudado (vista)', value: formatCurrency(totalPagado), accent: 'text-emerald-700' },
          { label: 'Total emitido (vista)', value: formatCurrency(totalMonto), accent: 'text-blue-700' },
        ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {card.label}
          </p>
          <p className={`mt-1 text-2xl font-bold ${card.accent}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}