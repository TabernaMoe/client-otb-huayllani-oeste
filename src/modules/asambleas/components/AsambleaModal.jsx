import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import { validateAsamblea } from '../schemas/asambleas.schema';

const EMPTY_FORM = {
  titulo: '',
  fecha: '',
  hora_inicio: '',
  lugar: '',
  monto_multa: '',
  monto_retraso: '',
};

export default function AsambleaModal({
  open,
  asamblea,
  loading,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm(
      asamblea
        ? {
            titulo: asamblea.titulo ?? '',
            fecha: asamblea.fecha ?? '',
            hora_inicio: asamblea.hora_inicio ?? '',
            lugar: asamblea.lugar ?? '',
            monto_multa: asamblea.monto_multa ?? '',
            monto_retraso: asamblea.monto_retraso ?? '',
          }
        : EMPTY_FORM,
    );
    setErrors({});
  }, [open, asamblea]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateAsamblea(form);
    if (!validation.ok) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }
    onSave(validation.data);
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={asamblea ? 'Editar asamblea' : 'Nueva asamblea'}
      description="Registra la reunión y los montos de multa por asistencia."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ElegantInput
              label="Título"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              error={errors.titulo}
              required
            />
          </div>
          <ElegantInput
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            error={errors.fecha}
            required
          />
          <ElegantInput
            label="Hora de inicio"
            name="hora_inicio"
            type="time"
            value={form.hora_inicio}
            onChange={handleChange}
            error={errors.hora_inicio}
            required
          />
          <div className="sm:col-span-2">
            <ElegantInput
              label="Lugar"
              name="lugar"
              value={form.lugar}
              onChange={handleChange}
              error={errors.lugar}
              required
            />
          </div>
          <ElegantInput
            label="Multa por falta (Bs)"
            name="monto_multa"
            type="number"
            value={form.monto_multa}
            onChange={handleChange}
            error={errors.monto_multa}
            required
          />
          <ElegantInput
            label="Multa por retraso (Bs)"
            name="monto_retraso"
            type="number"
            value={form.monto_retraso}
            onChange={handleChange}
            error={errors.monto_retraso}
            required
          />
        </div>

        <ModalFooter
          onCancel={onClose}
          saving={loading}
          submitLabel={asamblea ? 'Guardar cambios' : 'Crear asamblea'}
        />
      </form>
    </FormModal>
  );
}
