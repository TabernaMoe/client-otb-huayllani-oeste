import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FormModal from '../../../components/FormModal';
import ElegantInput from '../../../components/ElegantInput';
import SelectComponent from '../../../components/Select';
import { zodErrors } from '../../../utils/zodErrors';
import { DetalleAccionServices } from '../services/detalleAccion.services';
import { detalleAccionSchema } from '../schema/detalleAccion.schema';

const emptyForm = {
  tipo_accion_id: null,
  nombre_accion: '',
  precio_accion: '',
  tipo_cobro: null,
};

const cobroOptions = [
  { value: 'UNICO', label: 'Único' },
  { value: 'MENSUAL', label: 'Mensual' },
];

export default function DetalleAccionModal({ open, data, onClose, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [tipos, setTipos] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(data);

  useEffect(() => {
    if (!open) return;

    setForm(
      data
        ? {
            tipo_accion_id: data.tipo_accion_id,
            nombre_accion: data.nombre_accion,
            precio_accion: data.precio_accion,
            tipo_cobro: data.tipo_cobro,
          }
        : emptyForm,
    );
    setErrors({});

    DetalleAccionServices.getTiposAccion()
      .then((response) => setTipos(response.data))
      .catch((error) => toast.error(error.message));
  }, [open, data]);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const validation = detalleAccionSchema.safeParse(form);

    if (!validation.success) {
      setErrors(zodErrors(validation.error));
      return;
    }

    try {
      setLoading(true);
      const response = isEdit
        ? await DetalleAccionServices.update(data.id, validation.data)
        : await DetalleAccionServices.create(validation.data);

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
      title={isEdit ? 'Editar detalle de acción' : 'Nuevo detalle de acción'}
      description="Configura el concepto, precio y forma de cobro."
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-5">
        <SelectComponent
          label="Tipo de acción"
          placeholder="Seleccionar tipo"
          options={tipos}
          name="tipo_accion_id"
          value={form.tipo_accion_id}
          onChange={change}
          error={errors.tipo_accion_id}
        />

        <ElegantInput
          label="Nombre del detalle"
          name="nombre_accion"
          value={form.nombre_accion}
          onChange={change}
          error={errors.nombre_accion}
          placeholder="Ej. Carnet socio"
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <ElegantInput
            label="Precio"
            name="precio_accion"
            type="number"
            value={form.precio_accion}
            onChange={change}
            error={errors.precio_accion}
            placeholder="0.00"
            required
          />

          <SelectComponent
            label="Tipo de cobro"
            placeholder="Seleccionar"
            options={cobroOptions}
            name="tipo_cobro"
            value={form.tipo_cobro}
            onChange={change}
            error={errors.tipo_cobro}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancelar
          </button>
          <button disabled={loading} className="rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear detalle'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
