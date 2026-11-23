import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import SelectComponent from '../../../components/Select';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { validateAlcantarillado } from '../schema/alcantarillado.schema';
import { AlcantarilladoServices } from '../services/alcantarillado.services';

const EMPTY_FORM = {
  nombre_accion: '',
  precio_accion: '',
  tipo_cobro: 'UNICO',
};

const TIPOS_COBRO = [
  { value: 'UNICO', label: 'Único' },
  { value: 'MENSUAL', label: 'Mensual' },
];

export default function AlcantarilladoModal({ open, item, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const { submitting, run } = useAsyncSubmit();
  const isEdit = Boolean(item?.id);

  useEffect(() => {
    if (!open) return;
    setForm(
      item
        ? {
            nombre_accion: item.nombre_accion ?? '',
            precio_accion: String(item.precio_accion ?? ''),
            tipo_cobro: item.tipo_cobro ?? 'UNICO',
          }
        : EMPTY_FORM,
    );
    setErrors({});
  }, [open, item]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateAlcantarillado(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }

    await run(
      () =>
        isEdit
          ? AlcantarilladoServices.update(item.id, validation.data)
          : AlcantarilladoServices.create(validation.data),
      {
        successMessage: (res) =>
          res?.message || (isEdit ? 'Detalle actualizado' : 'Detalle creado'),
        errorMessage: 'No se pudo guardar el detalle de alcantarillado',
        onSuccess: async () => {
          await onSaved?.();
          onClose();
        },
      },
    );
  };

  return (
    <FormModal
      open={open}
      title={
        isEdit
          ? 'Editar detalle de alcantarillado'
          : 'Nuevo detalle de alcantarillado'
      }
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
            options={TIPOS_COBRO}
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
