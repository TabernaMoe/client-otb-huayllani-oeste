import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import SelectComponent from '../../../components/Select';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { getApiErrorMessage } from '../../../services/error';
import { validateDetalleAccion } from '../schema/detalleAccion.schema';
import { DetalleAccionServices } from '../services/detalleAccion.services';

const EMPTY_FORM = {
  tipo_accion_id: null,
  nombre_accion: '',
  precio_accion: '',
  tipo_cobro: null,
};

const COBRO_OPTIONS = [
  { value: 'UNICO', label: 'Único' },
  { value: 'MENSUAL', label: 'Mensual' },
];

export default function DetalleAccionModal({ open, data, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [tipos, setTipos] = useState([]);
  const [errors, setErrors] = useState({});
  const { submitting, run } = useAsyncSubmit();
  const isEdit = Boolean(data?.id);

  useEffect(() => {
    if (!open) return;

    setForm(
      data
        ? {
            tipo_accion_id: data.tipo_accion_id ?? null,
            nombre_accion: data.nombre_accion ?? '',
            precio_accion: data.precio_accion ?? '',
            tipo_cobro: data.tipo_cobro ?? null,
          }
        : EMPTY_FORM,
    );
    setErrors({});

    DetalleAccionServices.getTiposAccion()
      .then((response) => setTipos(response.data))
      .catch((error) =>
        toast.error(
          getApiErrorMessage(error, 'No se pudieron cargar los tipos de acción'),
        ),
      );
  }, [open, data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateDetalleAccion(form);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }

    await run(
      () =>
        isEdit
          ? DetalleAccionServices.update(data.id, validation.data)
          : DetalleAccionServices.create(validation.data),
      {
        successMessage: (res) =>
          res?.message || (isEdit ? 'Detalle actualizado' : 'Detalle creado'),
        errorMessage: 'No se pudo guardar el detalle de acción',
        onSuccess,
      },
    );
  };

  return (
    <FormModal
      open={open}
      title={isEdit ? 'Editar detalle de acción' : 'Nuevo detalle de acción'}
      description="Configura el concepto, precio y forma de cobro."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <SelectComponent
          label="Tipo de acción"
          placeholder="Seleccionar tipo"
          options={tipos}
          name="tipo_accion_id"
          value={form.tipo_accion_id}
          onChange={handleChange}
          error={errors.tipo_accion_id}
        />

        <ElegantInput
          label="Nombre del detalle"
          name="nombre_accion"
          value={form.nombre_accion}
          onChange={handleChange}
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
            onChange={handleChange}
            error={errors.precio_accion}
            placeholder="0.00"
            required
          />

          <SelectComponent
            label="Tipo de cobro"
            placeholder="Seleccionar"
            options={COBRO_OPTIONS}
            name="tipo_cobro"
            value={form.tipo_cobro}
            onChange={handleChange}
            error={errors.tipo_cobro}
          />
        </div>

        <ModalFooter
          onCancel={onClose}
          saving={submitting}
          submitLabel={isEdit ? 'Guardar cambios' : 'Crear detalle'}
        />
      </form>
    </FormModal>
  );
}
