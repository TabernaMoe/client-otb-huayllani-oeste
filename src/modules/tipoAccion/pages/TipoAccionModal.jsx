import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FormModal from '../../../components/FormModal';
import ElegantInput from '../../../components/ElegantInput';
import { zodErrors } from '../../../utils/zodErrors';
import { TipoAccionServices } from '../services/tipoAccion.services';
import { tipoAccionSchema } from '../schema/tipoaccion.schema';

export default function TipoAccionModal({ open, data, onClose, onSuccess }) {
  const [form, setForm] = useState({ nombre_tipo_accion: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(data);

  useEffect(() => {
    if (!open) return;
    setForm({ nombre_tipo_accion: data?.nombre_tipo_accion || '' });
    setErrors({});
  }, [open, data]);

  const submit = async (event) => {
    event.preventDefault();
    const validation = tipoAccionSchema.safeParse(form);

    if (!validation.success) {
      setErrors(zodErrors(validation.error));
      return;
    }

    try {
      setLoading(true);
      const response = isEdit
        ? await TipoAccionServices.update(data.id, validation.data)
        : await TipoAccionServices.create(validation.data);

      toast.success(response.message);
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
      title={isEdit ? 'Editar tipo de acción' : 'Nuevo tipo de acción'}
      description="Define la categoría que agrupará los detalles de acción."
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-6">
        <ElegantInput
          label="Nombre del tipo de acción"
          name="nombre_tipo_accion"
          value={form.nombre_tipo_accion}
          onChange={(e) => setForm({ nombre_tipo_accion: e.target.value })}
          error={errors.nombre_tipo_accion}
          placeholder="Ej. Acción de agua"
          required
        />

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancelar
          </button>
          <button disabled={loading} className="rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear tipo'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
