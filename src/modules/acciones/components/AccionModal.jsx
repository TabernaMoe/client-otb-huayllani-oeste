import { useEffect, useState } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import SelectComponent from '../../../components/Select';
import { CallesServices } from '../../calles/services/calles.services';
import { validateAccion } from '../schema/acciones.schema';
import { AccionesServices as Servs } from '../services/acciones.services';
import TipoAccionCards from './TipoAccionCards';

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

const estadoOptions = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'PASIVO', label: 'Pasivo' },
  { value: 'ANULADO', label: 'Anulado' },
];

export default function AccionModal({ open, onClose, onCreated }) {
  const [catalogos, setCatalogos] = useState({ socios: [], calles: [], tarifas: [], tipos: [] });
  const [detalles, setDetalles] = useState([]);
  const [tipoId, setTipoId] = useState('');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setForm(initialForm);
    setTipoId('');
    setDetalles([]);
    setErrors({});
    setMensaje('');
  };

  const close = () => {
    reset();
    onClose();
  };

  const loadCatalogos = async () => {
    const [socios, calles, tarifas, tipos] = await Promise.all([
      Servs.getSocios(),
      CallesServices.getAll(),
      Servs.getTarifas(),
      Servs.getTiposAccion(),
    ]);

    setCatalogos({
      socios: socios.data,
      calles: calles.data.map((item) => ({ value: item.id, label: item.nombre_calle })),
      tarifas: tarifas.data,
      tipos: tipos.data,
    });
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const selectTipo = async (id) => {
    setTipoId(id);
    setForm((prev) => ({ ...prev, detallesAccion: [] }));
    setErrors((prev) => ({ ...prev, detallesAccion: undefined }));

    const respuesta = await Servs.getDetallesAccion(id);
    setDetalles(respuesta.data);
  };

  const toggleDetalle = (id) => {
    const detalleId = Number(id);

    setForm((prev) => ({
      ...prev,
      detallesAccion: prev.detallesAccion.includes(detalleId)
        ? prev.detallesAccion.filter((item) => item !== detalleId)
        : [...prev.detallesAccion, detalleId],
    }));

    setErrors((prev) => ({ ...prev, detallesAccion: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateAccion(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    setMensaje('');

    const respuesta = await Servs.create(validation.data);

    if (!respuesta.ok) {
      setMensaje(respuesta.message);
      setSaving(false);
      return;
    }

    await onCreated?.();
    setSaving(false);
    close();
  };

  useEffect(() => {
    if (open) loadCatalogos();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Nueva acción</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Registrar acción</h2>
            <p className="mt-1 text-sm text-slate-500">Seleccione el tipo y complete los datos del registro.</p>
          </div>

          <button type="button" onClick={close} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        <div className="p-6">
          <section>
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900">1. Tipo de acción</h3>
              <p className="text-sm text-slate-500">Elija una carátula para continuar.</p>
            </div>

            <TipoAccionCards options={catalogos.tipos} value={tipoId} onChange={selectTipo} />
          </section>

          {tipoId && (
            <form onSubmit={handleSubmit} className="mt-7 space-y-7 border-t border-slate-200 pt-7">
              <section>
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">2. Datos de la acción</h3>
                  <p className="text-sm text-slate-500">Información principal del socio y del medidor.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <SelectComponent label="Socio" name="socio_id" options={catalogos.socios} value={form.socio_id} onChange={handleChange} error={errors.socio_id} />
                  <SelectComponent label="Calle" name="calle_id" options={catalogos.calles} value={form.calle_id} onChange={handleChange} error={errors.calle_id} />
                  <SelectComponent label="Tarifa de agua" name="tarifa_id" options={catalogos.tarifas} value={form.tarifa_id} onChange={handleChange} error={errors.tarifa_id} />
                  <ElegantInput label="Número de medidor" name="nro_medidor" value={form.nro_medidor} onChange={handleChange} error={errors.nro_medidor} required />
                  <ElegantInput label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} error={errors.direccion} required />
                  <SelectComponent label="Estado" name="estado" options={estadoOptions} value={form.estado} onChange={handleChange} error={errors.estado} />
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">3. Detalles</h3>
                  <p className="text-sm text-slate-500">Seleccione los detalles que corresponden a esta acción.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {detalles.map((detalle) => {
                    const selected = form.detallesAccion.includes(Number(detalle.value));

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

                {errors.detallesAccion && <p className="mt-2 text-sm font-medium text-red-500">{errors.detallesAccion}</p>}
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

              {mensaje && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{mensaje}</div>}

              <footer className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button type="button" onClick={close} disabled={saving} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancelar
                </button>

                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">
                  <CheckCircleIcon className="h-5 w-5" />
                  {saving ? 'Registrando...' : 'Registrar acción'}
                </button>
              </footer>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
