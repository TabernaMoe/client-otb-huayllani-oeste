import { XMarkIcon } from '@heroicons/react/24/outline';
import { formatMoney } from '../../../utils/cobrosAgua.utils';

export default function HistorialAguaModal({ open, historial, loading, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Historial de agua</h2>
            <p className="mt-1 text-sm text-slate-500">Pagos y cobros registrados para la acción.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto p-6">
          {loading ? (
            <p className="py-10 text-center text-sm text-slate-500">Cargando historial...</p>
          ) : (
            <div className="space-y-3">
              {historial.map((item, index) => (
                <div key={`${item.cobro_agua_id}-${index}`} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <p className="font-semibold text-slate-900">{item.concepto}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.periodo}</p>
                    </div>
                    <span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {item.estado}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Monto label="Total" value={item.monto_total} />
                    <Monto label="Pagado" value={item.monto_pagado} />
                    <Monto label="Saldo" value={item.saldo} primary />
                  </div>

                  {item.observacion && (
                    <p className="mt-3 text-sm text-slate-500">{item.observacion}</p>
                  )}
                </div>
              ))}

              {historial.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-500">No existen registros.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Monto({ label, value, primary = false }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 font-semibold ${primary ? 'text-blue-700' : 'text-slate-800'}`}>
        {formatMoney(value)}
      </p>
    </div>
  );
}
