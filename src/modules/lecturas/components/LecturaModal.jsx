import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import { validateLectura } from '../schema/lecturas.schema';
import { LecturasServices } from '../services/lecturas.services';

const INITIAL_FORM = {
  lectura_actual: '',
  observacion: '',
};

export default function LecturaModal({ open, accion, onClose, onSaved }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(INITIAL_FORM);
    setErrors({});
  }, [open, accion]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateLectura(form);
    setErrors(validation.errors);
    if (!validation.data) return;

    setSaving(true);
    const response = await LecturasServices.create(accion.id, validation.data);
    setSaving(false);

    if (!response.ok) {
      if (response.fieldErrors) setErrors(response.fieldErrors);
      toast.error(response.message || 'No se pudo registrar la lectura');
      return;
    }

    toast.success(response.message || 'Lectura registrada correctamente');
    onSaved?.();
    onClose();
  };

  const ultimaLectura = accion?.lecturas?.[0];

  return (
    <FormModal
      open={open}
      title="Registrar lectura"
      description="Ingresa la lectura actual del medidor para el periodo activo."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl bg-slate-50 p-4 text-sm">
          <p className="font-bold text-slate-900">{accion?.nombre_completo}</p>
          <p className="mt-1 text-slate-500">
            Acción #{accion?.codigo_interno} · Medidor{' '}
            {accion?.nro_medidor || 'S/N'}
          </p>
          {ultimaLectura && (
            <p className="mt-1 text-xs font-medium text-emerald-700">
              Última lectura ({ultimaLectura.periodo}):{' '}
              {ultimaLectura.lectura_actual} m³
            </p>
          )}
        </div>

        <ElegantInput
          label="Lectura actual (m³)"
          name="lectura_actual"
          type="number"
          value={form.lectura_actual}
          onChange={handleChange}
          error={errors.lectura_actual}
          placeholder="Ej. 150"
          required
        />

        <ElegantTextarea
          label="Observación (opcional)"
          name="observacion"
          value={form.observacion}
          onChange={handleChange}
          error={errors.observacion}
          rows={3}
          placeholder="Observación de la lectura (mínimo 5 caracteres si se ingresa)"
        />

        <ModalFooter
          onCancel={onClose}
          loading={saving}
          submitLabel="Registrar lectura"
        />
      </form>
    </FormModal>
  );
}
