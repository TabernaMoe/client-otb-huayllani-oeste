import { useEffect, useState } from 'react';
import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  ReceiptPercentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { DetalleAccionServices } from '../services/detalleAccion.services';
import { validateDetalleAccionForm } from '../schema/detalleAccion.schema';

const initialForm = {
  nombre_accion: '',
  precio_accion: '',
  tipo_cobro: '',
};

const inputClass = (hasError = false) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
  }`;

export default function DetalleAccionModal({
  open,
  detalle,
  onClose,
  onSuccess,
}) {
  const isEdit = Boolean(detalle);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return;

    if (detalle) {
      setForm({
        nombre_accion:
          detalle.nombre_accion ||
          detalle.nombre_detalle_accion ||
          '',
        precio_accion:
          detalle.precio_accion ??
          detalle.costo_detalles_accion ??
          '',
        tipo_cobro: detalle.tipo_cobro || '',
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
    setMessage('');
  }, [open, detalle]);

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

  const buildPayload = () => ({
    nombre_accion: form.nombre_accion.trim(),
    precio_accion: Number(form.precio_accion),
    tipo_cobro: form.tipo_cobro,
  });

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateDetalleAccionForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setMessage('Revise los campos marcados antes de guardar.');
      return;
    }

    setLoading(true);
    setMessage('');

    const payload = buildPayload();

    const response = isEdit
      ? await DetalleAccionServices.update(detalle.id, payload)
      : await DetalleAccionServices.create(payload);

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'No se pudo guardar el detalle');
      return;
    }

    onSuccess?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
              <ReceiptPercentIcon className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Detalles de acción</span>
                <span>/</span>
                <span className="text-emerald-700">
                  {isEdit ? 'Editar' : 'Nuevo'}
                </span>
              </div>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {isEdit
                  ? 'Editar detalle de acción'
                  : 'Registrar detalle de acción'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configura el concepto, precio y frecuencia del cobro.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-6">
            {message && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="font-medium">{message}</p>
              </div>
            )}

            <section>
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  1
                </span>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Información del concepto
                  </h3>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Define el nombre y el valor del detalle.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nombre del detalle
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <ClipboardDocumentListIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="nombre_accion"
                      value={form.nombre_accion}
                      onChange={handleChange}
                      placeholder="Ej. Cuota de conexión"
                      className={`${inputClass(
                        Boolean(errors.nombre_accion),
                      )} pl-11`}
                    />
                  </div>

                  {errors.nombre_accion && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                      <ExclamationCircleIcon className="h-4 w-4" />
                      {errors.nombre_accion}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Precio
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <BanknotesIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="number"
                      name="precio_accion"
                      min="0"
                      step="0.01"
                      value={form.precio_accion}
                      onChange={handleChange}
                      placeholder="Ej. 100.00"
                      className={`${inputClass(
                        Boolean(errors.precio_accion),
                      )} pl-11`}
                    />
                  </div>

                  {errors.precio_accion && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                      <ExclamationCircleIcon className="h-4 w-4" />
                      {errors.precio_accion}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tipo de cobro
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <ReceiptPercentIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <select
                      name="tipo_cobro"
                      value={form.tipo_cobro}
                      onChange={handleChange}
                      className={`${inputClass(
                        Boolean(errors.tipo_cobro),
                      )} appearance-none pl-11 pr-10`}
                    >
                      <option value="">
                        Seleccione tipo de cobro
                      </option>
                      <option value="UNICO">Único</option>
                      <option value="MENSUAL">Mensual</option>
                    </select>

                    <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  {errors.tipo_cobro && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                      <ExclamationCircleIcon className="h-4 w-4" />
                      {errors.tipo_cobro}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-white p-2 text-blue-700">
                  <ReceiptPercentIcon className="h-4 w-4" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-blue-900">
                    Información
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-blue-800/80">
                    El cobro único se genera una sola vez. El cobro mensual
                    puede utilizarse para conceptos periódicos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  {isEdit ? 'Guardar cambios' : 'Registrar detalle'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}