import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ElegantTextarea from '../../../components/ElegantTextarea';
import SelectComponent from '../../../components/Select';
import { validateAsistencia } from '../schemas/asambleas.schema';

const options = [
  { value: 'ASISTIO', label: 'Asistió' },
  { value: 'FALTA', label: 'Falta' },
  { value: 'SIN EFECTO', label: 'Sin efecto' },
  { value: 'RETRASO', label: 'Retraso' },
  { value: 'PERMISO', label: 'Permiso' },
];

export default function AsistenciaModal({ asistencia, loading, onClose, onSave }) {
  const [form, setForm] = useState({ asistio: 'ASISTIO', observacion: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!asistencia) return;
    setForm({ asistio: asistencia.asistio, observacion: asistencia.observacion || '' });
    setErrors({});
  }, [asistencia]);

  if (!asistencia) return null;

  const change = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const submit = (event) => {
    event.preventDefault();
    const validation = validateAsistencia(form);
    if (!validation.ok) return setErrors(validation.errors);
    onSave(validation.data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <form onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registrar asistencia</h2>
            <p className="mt-1 text-sm font-medium text-slate-600">{asistencia.nombre_completo}</p>
            <p className="text-xs text-slate-400">CI {asistencia.ci_socio} · Acción {asistencia.codigo_interno}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <SelectComponent label="Estado" name="asistio" value={form.asistio} options={options} onChange={change} error={errors.asistio} />
          <ElegantTextarea label="Observación" name="observacion" value={form.observacion} onChange={change} error={errors.observacion} rows={3} maxLength={250} />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancelar
          </button>
          <button disabled={loading} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {loading ? 'Guardando...' : 'Guardar asistencia'}
          </button>
        </div>
      </form>
    </div>
  );
}
