import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FormModal from '../../../components/FormModal';
import ElegantInput from '../../../components/ElegantInput';
import ModalFooter from '../../../components/ModalFooter';
import { LecturasServices } from '../services/lecturas.services';

const initialForm = {
  mora: '',
  observacion_mora: '',
};

export default function EditarMora({ open, lectura, onClose, onSaved }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      mora: lectura?.mora ?? '',
      observacion_mora: lectura?.observacion_mora ?? '',
    });
    setErrors({});
  }, [open, lectura]);

  const change = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await LecturasServices.updateMora({
        id: lectura.id,
        payload: {
          mora: Number(form.mora),
          observacion_mora: form.observacion_mora,
        },
      });

      if (!response.ok) {
        if (response.fieldErrors) setErrors(response.fieldErrors);
        toast.error(response.message || 'No se pudo modificar la mora');
        return;
      }

      toast.success(response.message || 'Mora actualizada correctamente');
      onSaved?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      title="Modificar mora"
      description={
        lectura?.periodo
          ? `Modificar la mora correspondiente al periodo ${lectura.periodo}`
          : 'Ingrese los nuevos datos de la mora'
      }
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <ElegantInput
            label="Ingrese mora"
            name="mora"
            type="number"
            value={form.mora}
            onChange={change}
            error={errors.mora}
            min="0"
            step="0.01"
            required
          />

          <ElegantInput
            label="Observación"
            name="observacion_mora"
            type="text"
            value={form.observacion_mora}
            onChange={change}
            error={errors.observacion_mora}
            required
          />
        </div>

        <ModalFooter
          onCancel={onClose}
          loading={loading}
          submitLabel="Guardar cambios"
        />
      </form>
    </FormModal>
  );
}
