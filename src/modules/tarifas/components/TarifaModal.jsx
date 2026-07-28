import { useEffect, useState } from 'react';
import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  PlusIcon,
  ScaleIcon,
  TrashIcon,
  XMarkIcon,
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

const inputClass = (hasError = false) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
  }`;

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }));

    setMessage('');
  };

  const handleRangoChange = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      rangosTarifa: previous.rangosTarifa.map((rango, i) =>
        i === index
          ? {
              ...rango,
              [field]: value,
            }
          : rango,
      ),
    }));

    setErrors((previous) => ({
      ...previous,
      [`${field}_${index}`]: '',
      rangosTarifa: '',
    }));

    setMessage('');
  };

  const addRango = () => {
    setForm((previous) => ({
      ...previous,
      rangosTarifa: [
        ...previous.rangosTarifa,
        { ...emptyRango },
      ],
    }));
  };

  const removeRango = (index) => {
    setForm((previous) => ({
      ...previous,
      rangosTarifa: previous.rangosTarifa.filter(
        (_, i) => i !== index,
      ),
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateTarifaForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setMessage('Revise los campos marcados antes de guardar.');
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
              <BanknotesIcon className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Tarifas</span>
                <span>/</span>
                <span className="text-emerald-700">
                  {isEdit ? 'Editar' : 'Nueva'}
                </span>
              </div>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {isEdit ? 'Editar tarifa' : 'Registrar nueva tarifa'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configura el nombre y los rangos de consumo aplicables.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(92vh-90px)] overflow-y-auto"
        >
          <div className="space-y-6 p-6">
            {message && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <section>
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  1
                </span>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Información principal
                  </h3>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Define el nombre que identificará a la tarifa.
                  </p>
                </div>
              </div>

              <div className="max-w-xl">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nombre de tarifa
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <CurrencyDollarIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="nombre_tarifa"
                    value={form.nombre_tarifa}
                    onChange={handleChange}
                    placeholder="Ej. Domiciliaria, Empresa, Social"
                    className={`${inputClass(
                      Boolean(errors.nombre_tarifa),
                    )} pl-11`}
                  />
                </div>

                {errors.nombre_tarifa && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.nombre_tarifa}
                  </p>
                )}
              </div>
            </section>

            <section>
              <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    2
                  </span>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Rangos de consumo
                    </h3>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Define los tramos y el precio correspondiente.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addRango}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
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
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white p-2 text-emerald-700 shadow-sm">
                          <ScaleIcon className="h-4 w-4" />
                        </span>

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Rango {index + 1}
                          </p>
                          <p className="text-xs text-slate-500">
                            Configura mínimo, máximo y precio.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeRango(index)}
                        disabled={form.rangosTarifa.length === 1}
                        className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Eliminar rango"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                          Consumo mínimo
                        </label>

                        <input
                          type="number"
                          value={rango.consumo_minimo}
                          onChange={(event) =>
                            handleRangoChange(
                              index,
                              'consumo_minimo',
                              event.target.value,
                            )
                          }
                          placeholder="0"
                          className={inputClass(
                            Boolean(
                              errors[`consumo_minimo_${index}`],
                            ),
                          )}
                        />

                        {errors[`consumo_minimo_${index}`] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[`consumo_minimo_${index}`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                          Consumo máximo
                        </label>

                        <input
                          type="number"
                          value={rango.consumo_maximo}
                          onChange={(event) =>
                            handleRangoChange(
                              index,
                              'consumo_maximo',
                              event.target.value,
                            )
                          }
                          placeholder="10"
                          className={inputClass(
                            Boolean(
                              errors[`consumo_maximo_${index}`],
                            ),
                          )}
                        />

                        {errors[`consumo_maximo_${index}`] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[`consumo_maximo_${index}`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                          Precio
                        </label>

                        <div className="relative">
                          <BanknotesIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                          <input
                            type="number"
                            value={rango.precio}
                            onChange={(event) =>
                              handleRangoChange(
                                index,
                                'precio',
                                event.target.value,
                              )
                            }
                            placeholder="10"
                            className={`${inputClass(
                              Boolean(errors[`precio_${index}`]),
                            )} pl-11`}
                          />
                        </div>

                        {errors[`precio_${index}`] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[`precio_${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  {isEdit ? 'Guardar cambios' : 'Registrar tarifa'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}