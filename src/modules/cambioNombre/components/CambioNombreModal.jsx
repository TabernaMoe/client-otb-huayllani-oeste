import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import FormModal from '../../../components/FormModal';
import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import SelectComponent from '../../../components/Select';
import { CambioNombreServices } from '../services/cambioNombre.services';
import { validateCambioNombre } from '../schema/cambioNombre.schema';

const emptyForm = {
  accion_id: null,
  socio_nuevo_id: null,
  tipo: null,
  observacion: '',
  monto: '',
};

const tipos = [
  { value: 'FAMILIAR', label: 'Familiar' },
  { value: 'AJENO', label: 'Ajeno' },
];

export default function CambioNombreModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [acciones, setAcciones] = useState([]);
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setForm(emptyForm);
    setErrors({});
    setLoading(true);

    Promise.all([
      CambioNombreServices.getAcciones(),
      CambioNombreServices.getSocios(),
    ]).then(([accionesResponse, sociosResponse]) => {
      setLoading(false);

      if (!accionesResponse.ok || !sociosResponse.ok) {
        toast.error(accionesResponse.message || sociosResponse.message);
        return;
      }

      setAcciones(accionesResponse.data);
      setSocios(sociosResponse.data);
    });
  }, [open]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateCambioNombre(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    const response = await CambioNombreServices.create(validation.data);
    setSaving(false);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    onSaved();
    onClose();
  };

  return (
    <FormModal
      open={open}
      title="Cambio de nombre de acción"
      description="Transfiere una acción a un nuevo socio."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <SelectComponent
          label="Acción"
          name="accion_id"
          value={form.accion_id}
          onChange={handleChange}
          options={acciones}
          error={errors.accion_id}
          isDisabled={loading}
        />

        <SelectComponent
          label="Nuevo socio"
          name="socio_nuevo_id"
          value={form.socio_nuevo_id}
          onChange={handleChange}
          options={socios}
          error={errors.socio_nuevo_id}
          isDisabled={loading}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectComponent
            label="Tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            options={tipos}
            error={errors.tipo}
          />

          <ElegantInput
            label="Monto"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            error={errors.monto}
            placeholder="0"
            required
          />
        </div>

        <ElegantTextarea
          label="Observación"
          name="observacion"
          value={form.observacion}
          onChange={handleChange}
          error={errors.observacion}
          rows={3}
          placeholder="Motivo del cambio de nombre"
          required
        />

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Procesando...' : 'Registrar cambio'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
