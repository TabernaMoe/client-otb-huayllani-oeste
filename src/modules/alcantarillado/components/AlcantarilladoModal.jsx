import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import FormModal from '../../../components/FormModal';
import ElegantInput from '../../../components/ElegantInput';
import SelectComponent from '../../../components/Select';
import { AlcantarilladoServices } from '../services/alcantarillado.services';
import { validateAlcantarillado } from '../schema/alcantarillado.schema';

const emptyForm = {
  nombre_accion: '',
  precio_accion: '',
  tipo_cobro: 'UNICO',
};

const tiposCobro = [
  { value: 'UNICO', label: 'Único' },
  { value: 'MENSUAL', label: 'Mensual' },
];

export default function AlcantarilladoModal({ open, item, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      item
        ? {
            nombre_accion: item.nombre_accion,
            precio_accion: item.precio_accion,
            tipo_cobro: item.tipo_cobro,
          }
        : emptyForm,
    );
    setErrors({});
  }, [open, item]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateAlcantarillado(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    const response = item
      ? await AlcantarilladoServices.update(item.id, validation.data)
      : await AlcantarilladoServices.create(validation.data);
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
      title={item ? 'Editar detalle de alcantarillado' : 'Nuevo detalle de alcantarillado'}
      description="Define el concepto, precio y modalidad de cobro."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <ElegantInput
          label="Nombre"
          name="nombre_accion"
          value={form.nombre_accion}
          onChange={handleChange}
          error={errors.nombre_accion}
          placeholder="Ej. Alcantarillado"
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <ElegantInput
            label="Precio"
            name="precio_accion"
            value={form.precio_accion}
            onChange={handleChange}
            error={errors.precio_accion}
            placeholder="350"
            required
          />

          <SelectComponent
            label="Tipo de cobro"
            name="tipo_cobro"
            value={form.tipo_cobro}
            onChange={handleChange}
            options={tiposCobro}
            error={errors.tipo_cobro}
          />
        </div>

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
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : item ? 'Guardar cambios' : 'Crear detalle'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
