import { formatMoney } from '../utils/cobros.utils';

export default function ResumenCobro({ cantidad, total }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-900">Resumen</h3>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">Conceptos</span>
        <span className="font-semibold text-slate-900">{cantidad}</span>
      </div>
      <div className="mt-3 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Saldo seleccionado</p>
        <p className="mt-1 text-2xl font-bold text-emerald-700">{formatMoney(total)}</p>
      </div>
    </div>
  );
}
