import { useEffect, useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { validateCalle } from '../schema/calles.schema';
import { CallesServices } from '../services/calles.services';

const INITIAL_FORM = { nombre_calle: '' };

export default function CalleModal({ open, calle, onClose, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const { submitting, run } = useAsyncSubmit();
  const isEdit = Boolean(calle?.id);

  useEffect(() => {
    if (!open) return;
    setForm(calle ? { nombre_calle: calle.nombre_calle ?? '' } : INITIAL_FORM);
    setErrors({});
  }, [open, calle]);

  const handleChange = (event) => {
    setForm({ nombre_calle: event.target.value });
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateCalle(form);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }

    await run(
      () =>
        isEdit
          ? CallesServices.update(calle.id, validation.data)
          : CallesServices.create(validation.data),
      {
        successMessage: isEdit
          ? 'Calle actualizada correctamente'
          : 'Calle creada correctamente',
        errorMessage: 'No se pudo guardar la calle',
        onSuccess,
      },
    );
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
          error={errors.nombre_calle}
          icon={<MapPinIcon className="h-5 w-5" />}
          required
        />

        <ModalFooter
          onCancel={onClose}
          saving={submitting}
          submitLabel={isEdit ? 'Guardar cambios' : 'Crear calle'}
        />
      </form>
    </FormModal>
  );
}
