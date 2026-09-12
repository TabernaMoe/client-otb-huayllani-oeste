import { useEffect, useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import FormModal from '../../../components/FormModal';
import ElegantInput from '../../../components/ElegantInput';
import { calleSchema } from '../schema/calles.schema';
import { CallesServices } from '../services/calles.services';

const initialForm = { nombre_calle: '' };

export default function CalleModal({ open, calle, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(calle);

  useEffect(() => {
    if (!open) return;
    setForm(calle ? { nombre_calle: calle.nombre_calle } : initialForm);
    setErrors({});
  }, [open, calle]);

  const handleChange = (event) => {
    setForm({ ...form, nombre_calle: event.target.value });
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = calleSchema.safeParse(form);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await CallesServices.update(calle.id, validation.data);
      } else {
        await CallesServices.create(validation.data);
      }

      toast.success(isEdit ? 'Calle actualizada correctamente' : 'Calle creada correctamente');
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      title={isEdit ? 'Editar calle' : 'Nueva calle'}
      description="Registra el nombre con el que se identificará la calle."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ElegantInput
          label="Nombre de la calle"
          name="nombre_calle"
          value={form.nombre_calle}
          onChange={handleChange}
          placeholder="Ej. Calle Perú"
          error={errors.nombre_calle?.[0]}
          icon={<MapPinIcon className="h-5 w-5" />}
          required
        />

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear calle'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
