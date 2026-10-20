import { useEffect, useState } from 'react';
import {
  PencilSquareIcon,
  InformationCircleIcon,
  CalculatorIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

import FormModal from '../../../components/FormModal';
import { updateOblyLecturaSchema } from '../schema/lecturas.schema';

export default function EditarLecturaModal({ open, lectura, onClose, onSave }) {
  const [form, setForm] = useState({
    lectura_anterior: '',
    lectura_actual: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    console.log(lectura);
    setForm({
      lectura_anterior: String(lectura?.lectura_anterior ?? ''),
      lectura_actual: String(lectura?.lectura_actual ?? ''),
    });

    setErrors({});
  }, [open, lectura]);

  const change = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const anterior = Number(form.lectura_anterior);
  const actual = Number(form.lectura_actual);

  const valoresCompletos =
    form.lectura_anterior.trim() !== '' && form.lectura_actual.trim() !== '';

  const consumoValido =
    valoresCompletos &&
    Number.isInteger(anterior) &&
    Number.isInteger(actual) &&
    anterior >= 0 &&
    actual >= anterior;

  const submit = async (e) => {
    e.preventDefault();

    const result = updateOblyLecturaSchema.safeParse(form);

    if (!result.success) {
      const newErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && !newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      await onSave({ id: lectura.id, payload: result.data });
      onClose();
    } catch (error) {
      setErrors({
        general: error?.message || 'No se pudo actualizar la lectura.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      title="Editar lectura"
      description={`Modificar registro del periodo ${lectura?.periodo ?? ''}`}
      onClose={loading ? undefined : onClose}
    >
      <form onSubmit={submit} className="space-y-5">
        {/* Información */}

        {/* Campos */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-5 flex items-center gap-2">
            <PencilSquareIcon className="h-5 w-5 text-emerald-600" />

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Datos del medidor
              </h3>
              <p className="text-xs text-slate-500">
                Ingresa los valores de las lecturas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Lectura anterior */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Lectura anterior <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="number"
                  name="lectura_anterior"
                  min="0"
                  step="1"
                  value={form.lectura_anterior}
                  onChange={change}
                  disabled={loading}
                  placeholder="Ej. 1250"
                  className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm font-semibold text-slate-800 outline-none transition focus:ring-2 ${
                    errors.lectura_anterior
                      ? 'border-red-300 focus:ring-red-100'
                      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
                  }`}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  m³
                </span>
              </div>

              {errors.lectura_anterior ? (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.lectura_anterior}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-400">
                  Registro anterior del medidor.
                </p>
              )}
            </div>

            {/* Lectura actual */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Lectura actual <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="number"
                  name="lectura_actual"
                  min="0"
                  step="1"
                  value={form.lectura_actual}
                  onChange={change}
                  disabled={loading}
                  placeholder="Ej. 1265"
                  className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm font-semibold text-slate-800 outline-none transition focus:ring-2 ${
                    errors.lectura_actual
                      ? 'border-red-300 focus:ring-red-100'
                      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
                  }`}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  m³
                </span>
              </div>

              {errors.lectura_actual ? (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.lectura_actual}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-400">
                  Valor actual del medidor.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Advertencia */}
        {valoresCompletos && actual < anterior && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
            <ExclamationCircleIcon className="h-5 w-5 shrink-0 text-red-500" />
            <p className="text-xs text-red-700">
              La lectura actual no puede ser menor que la lectura anterior.
            </p>
          </div>
        )}

        {errors.general && (
          <p className="text-sm text-red-600">{errors.general}</p>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading || !consumoValido}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckIcon className="h-4 w-4" />
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
