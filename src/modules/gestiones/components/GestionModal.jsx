import { useEffect, useState } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { formatZodErrorMessage } from '../../../services/error';
import { zodErrors } from '../../../utils/zodErrors';
import { gestionSchema } from '../schema/gestiones.schema';
import { GestionesServices } from '../services/gestiones.services';

export default function GestionModal({ open, onClose, onSuccess }) {
  const [anio, setAnio] = useState('');
  const [error, setError] = useState('');
  const { submitting, run } = useAsyncSubmit();

  useEffect(() => {
    if (!open) return;
    setAnio('');
    setError('');
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = gestionSchema.safeParse({ anio });

    if (!validation.success) {
      setError(zodErrors(validation.error).anio || '');
      toast.error(formatZodErrorMessage(validation.error));
      return;
    }

    await run(() => GestionesServices.create(validation.data), {
      successMessage: (res) => res?.message || 'Gestión creada correctamente',
      errorMessage: 'No se pudo crear la gestión',
      onSuccess: async () => {
        await onSuccess?.();
        onClose();
      },
    });
  };

  return (
    <FormModal
      open={open}
      title="Nueva gestión"
      description="Al crear una gestión, el backend genera sus períodos mensuales."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <ElegantInput
          label="Año"
          name="anio"
          type="number"
          value={anio}
          onChange={(event) => {
            setAnio(event.target.value);
            setError('');
          }}
          placeholder="2027"
          error={error}
          icon={<CalendarDaysIcon className="h-5 w-5" />}
          required
        />

        <ModalFooter
          onCancel={onClose}
          saving={submitting}
          submitLabel="Crear gestión"
          savingLabel="Creando..."
        />
      </form>
    </FormModal>
  );
}
