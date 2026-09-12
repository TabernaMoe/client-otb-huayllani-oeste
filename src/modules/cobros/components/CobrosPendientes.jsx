import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { formatMoney } from '../utils/cobros.utils';

export default function CobrosPendientes({
  socio,
  cobros,
  selectedIds,
  loading,
  error,
  onToggle,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h3 className="font-bold text-slate-900">2. Seleccionar conceptos</h3>
        <p className="mt-1 text-sm text-slate-500">
          {socio ? socio.nombre_completo : 'Selecciona primero un socio.'}
        </p>
      </div>

      <div className="p-4">
        {!socio ? (
          <div className="py-16 text-center text-sm text-slate-500">
            <ClipboardDocumentListIcon className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            Los cobros aparecerán aquí.
          </div>
        ) : loading ? (
          <div className="py-16 text-center text-sm text-slate-500">Cargando cobros...</div>
        ) : cobros.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">No hay cobros pendientes.</div>
        ) : (
          <div className="space-y-3">
            {cobros.map((cobro) => {
              const checked = selectedIds.includes(cobro.id);

              return (
                <label
                  key={cobro.id}
                  className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition ${
                    checked ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(cobro.id)}
                    className="mt-1 h-4 w-4 accent-emerald-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{cobro.concepto}</p>
                        <p className="mt-1 text-sm text-slate-500">{cobro.descripcion}</p>
                      </div>
                      <p className="font-bold text-emerald-700">{formatMoney(cobro.saldo)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>Total: {formatMoney(cobro.monto_total)}</span>
                      <span>Pagado: {formatMoney(cobro.monto_pagado)}</span>
                      <span>{cobro.estado}</span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
      </div>
    </section>
  );
}
