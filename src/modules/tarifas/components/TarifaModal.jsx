import { useEffect, useState } from 'react';
import {
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { TarifasServices } from '../services/tarifas.services';
import { validateTarifaForm } from '../schema/tarifas.schema';

const emptyRango = {
  consumo_minimo: '',
  consumo_maximo: '',
  precio: '',
};

const initialForm = {
  nombre_tarifa: '',
  rangosTarifa: [{ ...emptyRango }],
};

export default function TarifaModal({
  open,
  tarifa,
  onClose,
  onSuccess,
}) {
  const isEdit = Boolean(tarifa);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return;

    if (tarifa) {
      const rangos =
        tarifa.rangosTarifa ||
        tarifa.rangos_tarifa ||
        tarifa.rangos ||
        tarifa.tarifa_rangos ||
        [];

      setForm({
        nombre_tarifa: tarifa.nombre_tarifa || '',
        rangosTarifa:
          rangos.length > 0
            ? rangos.map((rango) => ({
                consumo_minimo:
                  rango.consumo_minimo ?? rango.rango_min ?? '',
                consumo_maximo:
                  rango.consumo_maximo ?? rango.rango_max ?? '',
                precio:
                  rango.precio ?? rango.precio_unitario ?? '',
              }))
            : [{ ...emptyRango }],
      });
    } else {
      setForm({
        nombre_tarifa: '',
        rangosTarifa: [{ ...emptyRango }],
      });
    }

    setErrors({});
    setMessage('');
  }, [open, tarifa]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setMessage('');
  };

  const handleRangoChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      rangosTarifa: prev.rangosTarifa.map((rango, i) =>
        i === index
          ? {
              ...rango,
              [field]: value,
            }
          : rango,
      ),
    }));

    setErrors((prev) => ({
      ...prev,
      [`${field}_${index}`]: '',
      rangosTarifa: '',
    }));

    setMessage('');
  };

  const addRango = () => {
    setForm((prev) => ({
      ...prev,
      rangosTarifa: [...prev.rangosTarifa, { ...emptyRango }],
    }));
  };

  const removeRango = (index) => {
    setForm((prev) => ({
      ...prev,
      rangosTarifa: prev.rangosTarifa.filter((_, i) => i !== index),
    }));
  };

  const buildPayload = () => ({
    nombre_tarifa: form.nombre_tarifa.trim(),
    rangosTarifa: form.rangosTarifa.map((rango) => ({
      consumo_minimo: Number(rango.consumo_minimo),
      consumo_maximo: Number(rango.consumo_maximo),
      precio: Number(rango.precio),
    })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateTarifaForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setMessage('');

    const payload = buildPayload();

    const response = isEdit
      ? await TarifasServices.update(tarifa.id, payload)
      : await TarifasServices.create(payload);

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'No se pudo guardar la tarifa');
      return;
    }

    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Editar tarifa' : 'Nueva tarifa'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Configura el nombre de la tarifa y sus rangos de consumo.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nombre de tarifa
            </label>

            <input
              type="text"
              name="nombre_tarifa"
              value={form.nombre_tarifa}
              onChange={handleChange}
              placeholder="Ej. Domiciliaria, Empresa, Social"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-700 focus:ring-4 focus:ring-sky-100"
            />

            {errors.nombre_tarifa && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nombre_tarifa}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-100 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800">
                  Rangos de tarifa
                </h3>
                <p className="text-sm text-slate-500">
                  Define los tramos de consumo y precio.
                </p>
              </div>

              <button
                type="button"
                onClick={addRango}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <PlusIcon className="h-5 w-5" />
                Agregar rango
              </button>
            </div>

            {errors.rangosTarifa && (
              <p className="mb-3 text-sm text-red-600">
                {errors.rangosTarifa}
              </p>
            )}

            <div className="space-y-3">
              {form.rangosTarifa.map((rango, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
                >
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Consumo mínimo
                    </label>
                    <input
                      type="number"
                      value={rango.consumo_minimo}
                      onChange={(e) =>
                        handleRangoChange(
                          index,
                          'consumo_minimo',
                          e.target.value,
                        )
                      }
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-700 focus:ring-4 focus:ring-sky-100"
                    />
                    {errors[`consumo_minimo_${index}`] && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors[`consumo_minimo_${index}`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Consumo máximo
                    </label>
                    <input
                      type="number"
                      value={rango.consumo_maximo}
                      onChange={(e) =>
                        handleRangoChange(
                          index,
                          'consumo_maximo',
                          e.target.value,
                        )
                      }
                      placeholder="10"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-700 focus:ring-4 focus:ring-sky-100"
                    />
                    {errors[`consumo_maximo_${index}`] && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors[`consumo_maximo_${index}`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Precio
                    </label>
                    <input
                      type="number"
                      value={rango.precio}
                      onChange={(e) =>
                        handleRangoChange(
                          index,
                          'precio',
                          e.target.value,
                        )
                      }
                      placeholder="10"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-700 focus:ring-4 focus:ring-sky-100"
                    />
                    {errors[`precio_${index}`] && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors[`precio_${index}`]}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeRango(index)}
                      disabled={form.rangosTarifa.length === 1}
                      className="rounded-xl border border-blue-200 p-2 text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                      title="Eliminar rango"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Guardar tarifa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}