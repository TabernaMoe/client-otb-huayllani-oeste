import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ElegantInput from '../../../components/ElegantInput';
import { validateAsamblea } from '../schemas/asambleas.schema';

const emptyForm = {
  titulo: '',
  fecha: '',
  hora_inicio: '',
  lugar: '',
  monto_multa: '',
  monto_retraso: '',
};

export default function AsambleaModal({ open, asamblea, loading, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm(asamblea ? {
      titulo: asamblea.titulo,
      fecha: asamblea.fecha,
      hora_inicio: asamblea.hora_inicio,
      lugar: asamblea.lugar,
      monto_multa: asamblea.monto_multa,
      monto_retraso: asamblea.monto_retraso,
    } : emptyForm);
    setErrors({});
  }, [open, asamblea]);

  if (!open) return null;

  const change = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const submit = (event) => {
    event.preventDefault();
    const validation = validateAsamblea(form);
    if (!validation.ok) return setErrors(validation.errors);
    onSave(validation.data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {asamblea ? 'Editar asamblea' : 'Nueva asamblea'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Registra la reunión y los montos de asistencia.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ElegantInput label="Título" name="titulo" value={form.titulo} onChange={change} error={errors.titulo} required />
          </div>
          <ElegantInput label="Fecha" name="fecha" type="date" value={form.fecha} onChange={change} error={errors.fecha} required />
          <ElegantInput label="Hora de inicio" name="hora_inicio" type="time" value={form.hora_inicio} onChange={change} error={errors.hora_inicio} required />
          <div className="sm:col-span-2">
            <ElegantInput label="Lugar" name="lugar" value={form.lugar} onChange={change} error={errors.lugar} required />
          </div>
          <ElegantInput label="Multa por falta (Bs)" name="monto_multa" type="number" value={form.monto_multa} onChange={change} error={errors.monto_multa} required />
          <ElegantInput label="Multa por retraso (Bs)" name="monto_retraso" type="number" value={form.monto_retraso} onChange={change} error={errors.monto_retraso} required />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancelar
          </button>
          <button disabled={loading} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
