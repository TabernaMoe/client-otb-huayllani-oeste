import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { AccionesServices } from '../services/acciones.services';
import { validateAccionForm } from '../schema/acciones.schema';

const initialForm = {
  socio_id: '',
  calle_id: '',
  tarifa_id: '',
  nro_medidor: '',
  direccion: '',
  observacion: '',
  estado: 'ACTIVO',
  detallesAccion: [],
};

const getOptionId = (item) => {
  if (typeof item === 'number') return item;
  if (typeof item === 'string') return Number(item);

  return Number(
    item?.id ??
      item?.value ??
      item?.detalle_accion_id ??
      item?.accion_detalle_id,
  );
};

const getSocioLabel = (socio) => {
  const nombre = [
    socio?.nombres,
    socio?.primer_apellido,
    socio?.segundo_apellido,
  ]
    .filter(Boolean)
    .join(' ');

  return nombre || socio?.nombre_completo || socio?.label || `Socio ${socio?.id}`;
};

const getCalleLabel = (calle) =>
  calle?.label ||
  calle?.nombre_calle ||
  calle?.nombre ||
  `Calle ${calle?.value || calle?.id}`;

const getTarifaLabel = (tarifa) =>
  tarifa?.nombre_tarifa ||
  tarifa?.label ||
  tarifa?.nombre ||
  `Tarifa ${tarifa?.id}`;

const getDetalleLabel = (detalle) =>
  detalle?.nombre_accion ||
  detalle?.nombre_detalle_accion ||
  detalle?.label ||
  detalle?.nombre ||
  detalle?.descripcion ||
  `Detalle ${detalle?.id || detalle?.value}`;

export default function AccionModal({ open, selected, onClose, onSaved }) {
  const [form, setForm] = useState(initialForm);

  const [socios, setSocios] = useState([]);
  const [calles, setCalles] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [detalles, setDetalles] = useState([]);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingSelects, setLoadingSelects] = useState(false);
  const [message, setMessage] = useState('');

  const loadSelects = async () => {
    setLoadingSelects(true);

    const [sociosRes, callesRes, tarifasRes, detallesRes] = await Promise.all([
      AccionesServices.getSociosSelect(),
      AccionesServices.getCallesSelect(),
      AccionesServices.getTarifasSelect(),
      AccionesServices.getDetallesAccionSelect(),
    ]);

    setLoadingSelects(false);

    if (!sociosRes.ok) setMessage(sociosRes.message || 'Error al cargar socios');
    if (!callesRes.ok) setMessage(callesRes.message || 'Error al cargar calles');
    if (!tarifasRes.ok) setMessage(tarifasRes.message || 'Error al cargar tarifas');
    if (!detallesRes.ok) setMessage(detallesRes.message || 'Error al cargar detalles');

    setSocios(sociosRes.data || []);
    setCalles(callesRes.data || []);
    setTarifas(tarifasRes.data || []);
    setDetalles(detallesRes.data || []);
  };

  useEffect(() => {
    if (!open) return;

    loadSelects();
    setMessage('');
    setErrors({});
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (selected) {
      const detalleIds = Array.isArray(selected.detallesAccion)
  ? selected.detallesAccion.map((item) => getOptionId(item))
  : [];

setForm({
  socio_id: selected.socio_id || selected.socio?.id || '',
  calle_id:
    selected.calle_id ||
    selected.calle?.id ||
    selected.calle?.value ||
    '',
  tarifa_id: selected.tarifa_id || selected.tarifa?.id || '',
  nro_medidor: selected.nro_medidor || '',
  direccion: selected.direccion || '',
  observacion: selected.observacion || '',
  estado: selected.estado || 'ACTIVO',
  detallesAccion: detalleIds.filter(Boolean),
});
    } else {
      setForm(initialForm);
    }
  }, [open, selected]);

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

  const toggleDetalle = (id) => {
    const detalleId = Number(id);
    if (!detalleId) return;

    setForm((prev) => ({
      ...prev,
      detallesAccion: prev.detallesAccion.includes(detalleId)
        ? prev.detallesAccion.filter((item) => item !== detalleId)
        : [...prev.detallesAccion, detalleId],
    }));

    setErrors((prev) => ({
      ...prev,
      detallesAccion: '',
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const validation = validateAccionForm(form);

  if (!validation.isValid) {
    setErrors(validation.errors);
    return;
  }

  setSaving(true);
  setMessage('');

  let payload = { ...validation.data };

  if (selected) {
    const medidorActual = String(selected.nro_medidor || '').trim();
    const medidorFormulario = String(payload.nro_medidor || '').trim();

    if (medidorActual === medidorFormulario) {
      delete payload.nro_medidor;
    }
  }

  const response = selected
    ? await AccionesServices.update(selected.id, payload)
    : await AccionesServices.create(payload);

  setSaving(false);

  if (!response.ok) {
    setMessage(response.message || 'Error al guardar la acción');
    return;
  }

  onSaved();
};

  if (!open) return null;

  const detallesAsignados = detalles.filter((detalle) => {
    const id = getOptionId(detalle);
    return form.detallesAccion.includes(id);
  });

  const detallesDisponibles = detalles.filter((detalle) => {
    const id = getOptionId(detalle);
    return !form.detallesAccion.includes(id);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {selected ? 'Editar acción' : 'Nueva acción'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Complete los datos de la acción del socio.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {message && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {message}
            </div>
          )}

          {loadingSelects && (
            <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              Cargando datos...
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Socio
              </label>
              <select
                name="socio_id"
                value={form.socio_id}
                onChange={handleChange}
                disabled={Boolean(selected)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
              >
                <option value="">Seleccionar socio</option>
                {socios.map((socio) => {
                  const id = getOptionId(socio);

                  return (
                    <option key={id} value={id}>
                      {getSocioLabel(socio)}
                    </option>
                  );
                })}
              </select>
              {errors.socio_id && (
                <p className="mt-1 text-sm text-red-600">{errors.socio_id}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Calle
              </label>
              <select
                name="calle_id"
                value={form.calle_id}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Seleccionar calle</option>
                {calles.map((calle) => {
                  const id = getOptionId(calle);

                  return (
                    <option key={id} value={id}>
                      {getCalleLabel(calle)}
                    </option>
                  );
                })}
              </select>
              {errors.calle_id && (
                <p className="mt-1 text-sm text-red-600">{errors.calle_id}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tarifa
              </label>
              <select
                name="tarifa_id"
                value={form.tarifa_id}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Seleccionar tarifa</option>
                {tarifas.map((tarifa) => {
                  const id = getOptionId(tarifa);

                  return (
                    <option key={id} value={id}>
                      {getTarifaLabel(tarifa)}
                    </option>
                  );
                })}
              </select>
              {errors.tarifa_id && (
                <p className="mt-1 text-sm text-red-600">{errors.tarifa_id}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nro. medidor
              </label>
              <input
                name="nro_medidor"
                value={form.nro_medidor}
                onChange={handleChange}
                placeholder="Ej. 4321"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              />
              {errors.nro_medidor && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nro_medidor}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Estado
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="PASIVO">PASIVO</option>
                <option value="ANULADO">ANULADO</option>
              </select>
              {errors.estado && (
                <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Dirección
              </label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Ej. Acopio 2"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              />
              {errors.direccion && (
                <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Observación
            </label>
            <textarea
              name="observacion"
              value={form.observacion}
              onChange={handleChange}
              placeholder="Sin observación"
              rows="3"
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Detalles de acción
            </p>

            {errors.detallesAccion && (
              <p className="mb-3 text-sm text-red-600">
                {errors.detallesAccion}
              </p>
            )}

            <div className="space-y-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-700">
                    Detalles disponibles
                  </p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                    {detallesDisponibles.length}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {detallesDisponibles.length === 0 ? (
                    <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-400">
                      No hay detalles disponibles
                    </div>
                  ) : (
                    detallesDisponibles.map((detalle) => {
                      const id = getOptionId(detalle);

                      return (
                        <label
                          key={id}
                          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => toggleDetalle(id)}
                            className="mt-1 h-4 w-4 accent-blue-800"
                          />

                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {getDetalleLabel(detalle)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Agregar a esta acción
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-blue-700">
                    Detalles asignados
                  </p>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    {detallesAsignados.length}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {detallesAsignados.length === 0 ? (
                    <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-400">
                      Todavía no hay detalles asignados
                    </div>
                  ) : (
                    detallesAsignados.map((detalle) => {
                      const id = getOptionId(detalle);

                      return (
                        <label
                          key={id}
                          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-blue-700 bg-blue-50 p-4 transition"
                        >
                          <input
                            type="checkbox"
                            checked
                            onChange={() => toggleDetalle(id)}
                            className="mt-1 h-4 w-4 accent-blue-800"
                          />

                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {getDetalleLabel(detalle)}
                            </p>
                            <p className="mt-1 text-xs text-blue-700">
                              Quitar de esta acción
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar acción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}