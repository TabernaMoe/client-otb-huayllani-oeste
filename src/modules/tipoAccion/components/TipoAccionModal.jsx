import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { validateTipoAccion } from '../schema/tipoAccion.schema';
import { TipoAccionServices } from '../services/tipoAccion.services';

export default function TipoAccionModal({ open, data, onClose, onSuccess }) {
  const [form, setForm] = useState({ nombre_tipo_accion: '' });
  const [errors, setErrors] = useState({});
  const { submitting, run } = useAsyncSubmit();
  const isEdit = Boolean(data?.id);

  useEffect(() => {
    if (!open) return;
    setForm({ nombre_tipo_accion: data?.nombre_tipo_accion || '' });
    setErrors({});
  }, [open, data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateTipoAccion(form);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }

    await run(
      () =>
        isEdit
          ? TipoAccionServices.update(data.id, validation.data)
          : TipoAccionServices.create(validation.data),
      {
        successMessage: (res) =>
          res?.message || (isEdit ? 'Tipo de acción actualizado' : 'Tipo de acción creado'),
        errorMessage: 'No se pudo guardar el tipo de acción',
        onSuccess,
      },
    );
  };

  return (
    <FormModal
      open={open}
      title={isEdit ? 'Editar tipo de acción' : 'Nuevo tipo de acción'}
      description="Define la categoría que agrupará los detalles de acción."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ElegantInput
          label="Nombre del tipo de acción"
          name="nombre_tipo_accion"
          value={form.nombre_tipo_accion}
          onChange={(e) => {
            setForm({ nombre_tipo_accion: e.target.value });
            setErrors({});
          }}
          error={errors.nombre_tipo_accion}
          placeholder="Ej. Acción de agua"
          required
        />

        <ModalFooter
          onCancel={onClose}
          saving={submitting}
          submitLabel={isEdit ? 'Guardar cambios' : 'Crear tipo'}
        />
      </form>
    </FormModal>
  );
}
