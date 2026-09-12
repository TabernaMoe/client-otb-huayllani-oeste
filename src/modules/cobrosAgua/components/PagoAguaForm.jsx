import { CreditCardIcon } from '@heroicons/react/24/outline';
import ElegantTextarea from '../../../components/ElegantTextarea';
import SelectComponent from '../../../components/Select';
import { formatMoney } from '../../../utils/cobrosAgua.utils';

const METODOS = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'QR', label: 'QR' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
];

export default function PagoAguaForm({
  cobro,
  form,
  errors,
  saving,
  onChange,
  onSubmit,
}) {
  if (!cobro) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
        Selecciona un cobro pendiente para registrar el pago.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">Registrar pago</h3>
          <p className="mt-1 text-sm text-slate-500">{cobro.concepto}</p>
        </div>
        <strong className="text-lg text-blue-700">{formatMoney(cobro.saldo)}</strong>
      </div>

      <SelectComponent
        label="Método de pago"
        name="metodo_pago"
        value={form.metodo_pago}
        options={METODOS}
        onChange={onChange}
        error={errors.metodo_pago}
      />

      <ElegantTextarea
        label="Observación"
        name="observacion"
        value={form.observacion}
        onChange={onChange}
        rows={3}
        maxLength={250}
        error={errors.observacion}
      />

      <button
        type="submit"
        disabled={saving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
      >
        <CreditCardIcon className="h-5 w-5" />
        {saving ? 'Procesando...' : `Cobrar ${formatMoney(cobro.saldo)}`}
      </button>
    </form>
  );
}
