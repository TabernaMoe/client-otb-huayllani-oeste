import { useEffect, useState } from 'react';
import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import FormModal from '../../../components/FormModal';
import Select from '../../../components/Select';
import { cobroUniversalSchema } from '../schema/cobroUniversal.schema';
import { CobroUniversalServices } from '../services/cobroUniversal.services';

const initialForm = { accion_id: '', concepto: '', descripcion: '', monto: '' };

const toOption = (item) => ({
  value: item.value ?? item.id ?? item.accion_id,
  label: item.label ?? item.nombre ?? item.socio ?? `Acción #${item.id ?? item.accion_id}`,
});

export default function CobroUniversalModal({ open, cobro, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [acciones, setAcciones] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingAcciones, setLoadingAcciones] = useState(false);
  const isEdit = Boolean(cobro);

  useEffect(() => {
    if (!open) return;
    setForm(cobro ? {
      accion_id: cobro.accion_id ?? cobro.accion?.id ?? '',
      concepto: cobro.concepto ?? '',
      descripcion: cobro.descripcion ?? '',
      monto: cobro.monto ?? '',
    } : initialForm);
    setErrors({});
  }, [open, cobro]);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        setLoadingAcciones(true);
        const response = await CobroUniversalServices.getAcciones();
        const items = Array.isArray(response) ? response : response?.data ?? [];
        setAcciones(items.map(toOption));
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingAcciones(false);
      }
    };
    load();
  }, [open]);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = cobroUniversalSchema.safeParse(form);
    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    try {
      setLoading(true);
      if (isEdit) await CobroUniversalServices.update(cobro.id, validation.data);
      else await CobroUniversalServices.create(validation.data);
      toast.success(isEdit ? 'Cobro actualizado correctamente' : 'Cobro creado correctamente');
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
      title={isEdit ? 'Editar cobro universal' : 'Nuevo cobro universal'}
      description="Registra un cobro asociado a una acción. Concepto e importe son obligatorios."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Select
          label="Acción"
          name="accion_id"
          value={form.accion_id}
          onChange={(event) => {
            setForm((current) => ({ ...current, accion_id: event.target.value }));
            setErrors((current) => ({ ...current, accion_id: undefined }));
          }}
          options={acciones}
          placeholder={loadingAcciones ? 'Cargando acciones...' : 'Selecciona una acción'}
          error={errors.accion_id?.[0]}
          required
        />

        <ElegantInput
          label="Concepto"
          name="concepto"
          value={form.concepto}
          onChange={change}
          placeholder="Ej. Recibo madre / cobro extraordinario"
          error={errors.concepto?.[0]}
          icon={<DocumentTextIcon className="h-5 w-5" />}
          required
        />

        <ElegantTextarea
          label="Descripción"
          name="descripcion"
          value={form.descripcion}
          onChange={change}
          placeholder="Detalle opcional del cobro"
          error={errors.descripcion?.[0]}
        />

        <ElegantInput
          label="Importe (Bs)"
          name="monto"
          type="number"
          min="0.01"
          step="0.01"
          value={form.monto}
          onChange={change}
          placeholder="0.00"
          error={errors.monto?.[0]}
          icon={<BanknotesIcon className="h-5 w-5" />}
          required
        />

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" disabled={loading || loadingAcciones} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear cobro'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
