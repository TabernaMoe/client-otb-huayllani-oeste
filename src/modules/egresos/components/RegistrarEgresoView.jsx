import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BanknotesIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  PlusCircleIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import SelectComponent from '../../../components/Select';
import { EgresosServices } from '../services/egresos.services';
import { validateEgreso } from '../schema/egresos.schema';

function today() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

const createInitialForm = () => ({
  categoria_egreso_id: null,
  fecha: today(),
  concepto: '',
  monto: '',
  beneficiario: '',
  observaciones: '',
});

function formatDate(value) {
  if (!value) return '-';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export default function RegistrarEgresoView() {
  const [form, setForm] = useState(createInitialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [egresos, setEgresos] = useState([]);

  const cargarDatos = useCallback(async () => {
    setLoading(true);

    const [categoriasResponse, egresosResponse] = await Promise.all([
      EgresosServices.getCategorias(),
      EgresosServices.getAll(),
    ]);

    setCategorias(Array.isArray(categoriasResponse?.data) ? categoriasResponse.data : []);
    setEgresos(Array.isArray(egresosResponse?.data) ? egresosResponse.data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const categoriaOptions = useMemo(
    () => categorias.map((categoria) => ({
      value: Number(categoria.id),
      label: categoria.nombre_gasto,
    })),
    [categorias],
  );

  const categoriasById = useMemo(
    () => Object.fromEntries(categorias.map((categoria) => [categoria.id, categoria.nombre_gasto])),
    [categorias],
  );

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateEgreso(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    const response = await EgresosServices.create(validation.data);
    setSaving(false);

    if (!response?.ok) {
      setMessage({ type: 'error', text: response?.message || 'No se pudo registrar el egreso' });
      return;
    }

    setForm(createInitialForm());
    setErrors({});
    setMessage({ type: 'success', text: response.message || 'Egreso registrado correctamente' });
    await cargarDatos();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <PlusCircleIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registrar nuevo egreso</h2>
            <p className="mt-1 text-sm text-slate-500">
              Completa la información del gasto realizado por la OTB.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <SelectComponent
              label="Tipo de egreso"
              name="categoria_egreso_id"
              options={categoriaOptions}
              value={form.categoria_egreso_id}
              onChange={handleChange}
              error={errors.categoria_egreso_id}
              isDisabled={loading}
              placeholder={loading ? 'Cargando categorías...' : 'Seleccionar categoría'}
            />

            <ElegantInput
              label="Fecha"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              error={errors.fecha}
              required
              icon={<CalendarDaysIcon className="h-5 w-5" />}
            />
          </div>

          <ElegantInput
            label="Concepto del egreso"
            name="concepto"
            value={form.concepto}
            onChange={handleChange}
            placeholder="Ej: Compra de tuberías PVC"
            error={errors.concepto}
            required
            icon={<ReceiptPercentIcon className="h-5 w-5" />}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <ElegantInput
              label="Monto (Bs)"
              name="monto"
              type="number"
              value={form.monto}
              onChange={handleChange}
              placeholder="0.00"
              error={errors.monto}
              required
              icon={<BanknotesIcon className="h-5 w-5" />}
            />

            <ElegantInput
              label="Beneficiario / proveedor"
              name="beneficiario"
              value={form.beneficiario}
              onChange={handleChange}
              placeholder="Persona o empresa que recibe el pago"
              error={errors.beneficiario}
              required
              icon={<IdentificationIcon className="h-5 w-5" />}
            />
          </div>

          <ElegantTextarea
            label="Observaciones"
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Detalles adicionales del egreso"
            error={errors.observaciones}
            required
            rows={4}
          />

          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || categorias.length === 0}
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Registrando...' : 'Registrar egreso'}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-bold text-slate-900">Egresos registrados</h2>
          <p className="mt-1 text-sm text-slate-500">
            Historial de gastos registrados en el sistema.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Fecha</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Tipo</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Concepto</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Beneficiario</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-600">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Cargando...</td>
                </tr>
              ) : egresos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No hay egresos registrados</td>
                </tr>
              ) : (
                egresos.map((egreso) => (
                  <tr key={egreso.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">{formatDate(egreso.fecha)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {categoriasById[egreso.categoria_egreso_id] || `Categoría #${egreso.categoria_egreso_id}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{egreso.concepto}</td>
                    <td className="px-6 py-4 text-slate-600">{egreso.beneficiario}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-bold text-slate-800">
                      Bs {Number(egreso.monto || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
