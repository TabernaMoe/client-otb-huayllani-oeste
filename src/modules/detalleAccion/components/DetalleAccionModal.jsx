import { useEffect, useState } from 'react';

import { DetalleAccionServices } from '../services/detalleAccion.services';
import { validateDetalleAccionForm } from '../schema/detalleAccion.schema';

const initialForm = {
  nombre_accion: '',
  precio_accion: '',
  tipo_cobro: '',
};

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

  const buildPayload = () => ({
    nombre_accion: form.nombre_accion.trim(),
    precio_accion: Number(form.precio_accion),
    tipo_cobro: form.tipo_cobro,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateDetalleAccionForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Editar detalle de acción' : 'Nuevo detalle de acción'}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configura el concepto de cobro relacionado a las acciones.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nombre del detalle
            </label>

            <input
              type="text"
              name="nombre_accion"
              value={form.nombre_accion}
              onChange={handleChange}
              placeholder="Ej. Carnet socio"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
            />

            {errors.nombre_accion && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nombre_accion}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Precio
            </label>

            <input
              type="number"
              name="precio_accion"
              value={form.precio_accion}
              onChange={handleChange}
              placeholder="Ej. 100"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
            />

            {errors.precio_accion && (
              <p className="mt-1 text-sm text-red-600">
                {errors.precio_accion}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tipo de cobro
            </label>

            <select
              name="tipo_cobro"
              value={form.tipo_cobro}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
            >
              <option value="">Seleccione tipo de cobro</option>
              <option value="UNICO">Único</option>
              <option value="MENSUAL">Mensual</option>
            </select>

            {errors.tipo_cobro && (
              <p className="mt-1 text-sm text-red-600">
                {errors.tipo_cobro}
              </p>
            )}
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
              className="rounded-2xl bg-red-800 px-5 py-3 text-sm font-semibold text-white hover:bg-red-900 disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Guardar detalle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}