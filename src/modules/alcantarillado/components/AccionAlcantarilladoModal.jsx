import { useEffect, useState } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import SelectComponent from '../../../components/Select';
import { validateAccionAlcantarillado } from '../schema/accionesAlcantarillado.schema';
import { AlcantarilladoServices as Servs } from '../services/accionesAlcantarillado.services';

const initialForm = {
  socio_id: '',
  calle_id: '',
  direccion: '',
  observacion: '',
  detalles: [],
};

const normalizeForm = (data = {}) => ({
  socio_id: data.socio_id ?? '',
  calle_id: data.calle_id ?? '',
  direccion: data.direccion ?? '',
  observacion: data.observacion ?? '',
  detalles: Array.isArray(data.detalles)
    ? data.detalles.map((item) => Number(item))
    : [],
});

export default function AccionAlcantarilladoModal({
  open,
  onClose,
  onCreated,
  id,
}) {
  const isEditing = Boolean(id);
  const [catalogos, setCatalogos] = useState({ socios: [], calles: [] });
  const [detalles, setDetalles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const reset = () => {
    setForm(initialForm);
    setDetalles([]);
    setErrors({});
    setMensaje('');
    setSaving(false);
    setLoadingData(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const loadCatalogos = async () => {
    const [socios, calles, detallesResponse] = await Promise.all([
      Servs.getSocios(),
      Servs.getCalles(),
      Servs.getDetalle(),
    ]);

    if (!socios.ok || !calles.ok || !detallesResponse.ok) {
      setMensaje(
        socios.message ||
          calles.message ||
          detallesResponse.message ||
          'No se pudieron cargar los catálogos.',
      );
      return;
    }

    setCatalogos({
      socios: socios.data || [],
      calles: calles.data || [],
    });
    setDetalles(detallesResponse.data || []);
  };

  const loadAccion = async () => {
    if (!id) return;

    setLoadingData(true);
    const response = await Servs.getId({ id });
    setLoadingData(false);

    if (!response.ok) {
      setMensaje(response.message || 'No se pudo obtener la acción.');
      return;
    }

    setForm(normalizeForm(response.data));
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setMensaje('');
  };

  const toggleDetalle = (idDetalle) => {
    const detalleId = Number(idDetalle);

    setForm((prev) => ({
      ...prev,
      detalles: prev.detalles.includes(detalleId)
        ? prev.detalles.filter((item) => item !== detalleId)
        : [...prev.detalles, detalleId],
    }));

    setErrors((prev) => ({ ...prev, detalles: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateAccionAlcantarillado(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    setMensaje('');

    const respuesta = isEditing
      ? await Servs.update({ id, payload: validation.data })
      : await Servs.create({ payload: validation.data });

    setSaving(false);

    if (!respuesta.ok) {
      setMensaje(respuesta.message || 'No se pudo guardar la acción.');
      return;
    }

    await onCreated?.();
    close();
  };

  useEffect(() => {
    if (!open) return;

    setErrors({});
    setMensaje('');
    loadCatalogos();
    loadAccion();
  }, [open, id]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              {isEditing ? 'Editar acción' : 'Nueva acción'}
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {isEditing
                ? 'Editar acción de alcantarillado'
                : 'Registrar acción de alcantarillado'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? 'Los datos actuales se cargaron desde la acción seleccionada.'
                : 'Complete los datos y seleccione los conceptos correspondientes.'}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        <div className="p-6">
          {loadingData ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Cargando acción...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <section>
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">
                    1. Datos de la acción
                  </h3>
                  <p className="text-sm text-slate-500">
                    Información principal del socio y su ubicación.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <SelectComponent
                    label="Socio"
                    name="socio_id"
                    options={catalogos.socios}
                    value={form.socio_id}
                    onChange={handleChange}
                    error={errors.socio_id}
                  />
                  <SelectComponent
                    label="Calle"
                    name="calle_id"
                    options={catalogos.calles}
                    value={form.calle_id}
                    onChange={handleChange}
                    error={errors.calle_id}
                  />
                  <ElegantInput
                    label="Dirección"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    error={errors.direccion}
                    required
                  />
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">2. Detalles</h3>
                  <p className="text-sm text-slate-500">
                    Seleccione los detalles que corresponden a esta acción.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {detalles.map((detalle) => {
                    const selected = form.detalles.includes(
                      Number(detalle.value),
                    );

                    return (
                      <button
                        key={detalle.value}
                        type="button"
                        onClick={() => toggleDetalle(detalle.value)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          selected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-400 hover:bg-emerald-50'
                        }`}
                      >
                        {detalle.label}
                      </button>
                    );
                  })}
                </div>

                {errors.detalles && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.detalles}
                  </p>
                )}
              </section>

              <section>
                <ElegantTextarea
                  label="Observación"
                  name="observacion"
                  value={form.observacion}
                  onChange={handleChange}
                  error={errors.observacion}
                  rows={3}
                  maxLength={500}
                />
              </section>

              {mensaje && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {mensaje}
                </div>
              )}

              <footer className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={close}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  {saving
                    ? 'Guardando...'
                    : isEditing
                      ? 'Guardar cambios'
                      : 'Registrar acción'}
                </button>
              </footer>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
