import { ClockIcon } from '@heroicons/react/24/outline';
import { formatMoney } from '../../../utils/cobrosAgua.utils';
import PagoAguaForm from './PagoAguaForm';

const Estado = ({ value }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
      value === 'PAGADO'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-amber-50 text-amber-700'
    }`}
  >
    {value}
  </span>
);

export default function CobrosAguaDetalle({
  detalle,
  cobros,
  selectedCobro,
  loading,
  form,
  errors,
  saving,
  onSelectCobro,
  onChange,
  onSubmit,
  onHistorial,
}) {
  if (!detalle) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Selecciona una acción para ver sus cobros de agua.
      </div>
    );
  }

  const pendiente = cobros.reduce((total, item) => total + Number(item.saldo), 0);

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{detalle.nombre_completo}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Medidor {detalle.nro_medidor} · {detalle.nombre_calle} · {detalle.nombre_tarifa}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 px-4 py-2 text-right">
            <p className="text-xs font-medium text-blue-600">Pendiente</p>
            <p className="font-bold text-blue-800">{formatMoney(pendiente)}</p>
          </div>
          <button
            type="button"
            onClick={onHistorial}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ClockIcon className="h-4 w-4" />
            Historial
          </button>
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando cobros...</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {cobros.map((cobro) => (
            <button
              key={cobro.cobro_agua_id}
              type="button"
              onClick={() => onSelectCobro(cobro)}
              className={`rounded-xl border p-4 text-left transition ${
                selectedCobro?.cobro_agua_id === cobro.cobro_agua_id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{cobro.concepto}</p>
                  <p className="mt-1 text-xs text-slate-500">{cobro.descripcion}</p>
                </div>
                <Estado value={cobro.estado} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Total</p>
                  <p className="mt-1 font-semibold text-slate-700">{formatMoney(cobro.monto_total)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Pagado</p>
                  <p className="mt-1 font-semibold text-slate-700">{formatMoney(cobro.monto_pagado)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Saldo</p>
                  <p className="mt-1 font-bold text-blue-700">{formatMoney(cobro.saldo)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && cobros.length === 0 && (
        <p className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          Esta acción no tiene cobros de agua pendientes.
        </p>
      )}

      <PagoAguaForm
        cobro={selectedCobro}
        form={form}
        errors={errors}
        saving={saving}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
