import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import { validateLectura } from '../schema/lecturas.schema';
import { LecturasServices } from '../services/lecturas.services';

const config = {
  create: {
    title: 'Registrar lectura',
    description: 'Ingresa la lectura actual del medidor.',
    button: 'Registrar lectura',
  },
  edit: {
    title: 'Editar lectura',
    description: 'Actualiza la lectura del periodo actual.',
    button: 'Guardar cambios',
  },
  cambio: {
    title: 'Cambio de medidor',
    description: 'Registra la lectura del medidor al realizar el cambio.',
    button: 'Registrar cambio',
  },
};

export default function LecturaModal({ open, mode, accion, onClose, onSaved }) {
  const [form, setForm] = useState({ lectura_actual: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      lectura_actual:
        mode === 'edit' ? String(accion?.lecturas?.[0]?.lectura_actual ?? '') : '',
    });
    setErrors({});
  }, [open, mode, accion]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateLectura(form);
    setErrors(validation.errors);
    if (!validation.data) return;

    setSaving(true);

    const methods = {
      create: LecturasServices.create,
      edit: LecturasServices.update,
      cambio: LecturasServices.cambioMedidor,
    };

    const response = await methods[mode](accion.id, validation.data);
    setSaving(false);

    if (!response.ok) return toast.error(response.message);

    toast.success(response.message);
    onSaved();
    onClose();
  };

  const data = config[mode];

  return (
    <FormModal open={open} title={data.title} description={data.description} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl bg-slate-50 p-4 text-sm">
          <p className="font-bold text-slate-900">{accion?.nombre_completo}</p>
          <p className="mt-1 text-slate-500">
            Acción #{accion?.codigo_interno} · Medidor {accion?.nro_medidor}
          </p>
        </div>

        <ElegantInput
          label="Lectura actual (m³)"
          name="lectura_actual"
          type="number"
          value={form.lectura_actual}
          onChange={(event) => {
            setForm({ lectura_actual: event.target.value });
            setErrors({});
          }}
          error={errors.lectura_actual}
          required
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Guardando...' : data.button}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
