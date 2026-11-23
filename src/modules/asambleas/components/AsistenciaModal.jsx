import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantTextarea from '../../../components/ElegantTextarea';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import SelectComponent from '../../../components/Select';
import { validateAsistencia } from '../schemas/asambleas.schema';

const OPTIONS = [
  { value: 'ASISTIO', label: 'Asistió' },
  { value: 'FALTA', label: 'Falta' },
  { value: 'SIN EFECTO', label: 'Sin efecto' },
  { value: 'RETRASO', label: 'Retraso' },
  { value: 'PERMISO', label: 'Permiso' },
];

export default function AsistenciaModal({
  asistencia,
  loading,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({ asistio: 'ASISTIO', observacion: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!asistencia) return;
    setForm({
      asistio: asistencia.asistio ?? 'ASISTIO',
      observacion: asistencia.observacion || '',
    });
    setErrors({});
  }, [asistencia]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateAsistencia(form);
    if (!validation.ok) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }
    onSave(validation.data);
  };

  return (
    <FormModal
      open={Boolean(asistencia)}
      onClose={onClose}
      title="Registrar asistencia"
      description={
        asistencia
          ? `${asistencia.nombre_completo} · CI ${asistencia.ci_socio} · Acción ${asistencia.codigo_interno}`
          : ''
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <SelectComponent
          label="Estado"
          name="asistio"
          value={form.asistio}
          options={OPTIONS}
          onChange={handleChange}
          error={errors.asistio}
        />
        <ElegantTextarea
          label="Observación"
          name="observacion"
          value={form.observacion}
          onChange={handleChange}
          error={errors.observacion}
          rows={3}
          maxLength={250}
        />

        <ModalFooter
          onCancel={onClose}
          saving={loading}
          submitLabel="Guardar asistencia"
        />
      </form>
    </FormModal>
  );
}
