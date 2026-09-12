import { BanknotesIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import ElegantInput from '../../../components/ElegantInput';
import SelectComponent from '../../../components/Select';

const metodos = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'QR', label: 'QR' },
];

export default function FormularioPago({
  form,
  errors,
  saving,
  disabled,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-900">3. Registrar pago</h3>
      <div className="mt-5 space-y-4">
        <SelectComponent
          label="Método de pago"
          name="metodo_pago"
          options={metodos}
          value={form.metodo_pago}
          onChange={onChange}
          error={errors.metodo_pago}
          isDisabled={disabled || saving}
        />
        <ElegantInput
          label="Monto a pagar"
          name="monto"
          type="number"
          value={form.monto}
          onChange={onChange}
          error={errors.monto}
          disabled={disabled || saving}
          placeholder="0.00"
          icon={<BanknotesIcon className="h-5 w-5" />}
          required
        />
        {errors.socio_id && <p className="text-sm font-medium text-red-500">{errors.socio_id}</p>}
        <button
          type="submit"
          disabled={disabled || saving || form.cobros.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {form.metodo_pago === 'QR' && <QrCodeIcon className="h-5 w-5" />}
          {saving ? 'Procesando...' : form.metodo_pago === 'QR' ? 'Generar QR' : 'Registrar pago'}
        </button>
      </div>
    </form>
  );
}
