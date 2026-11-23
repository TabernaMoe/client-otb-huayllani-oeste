import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import SelectComponent from '../../../components/Select';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { validateCambioNombre } from '../schema/cambioNombre.schema';
import { CambioNombreServices } from '../services/cambioNombre.services';

const EMPTY_FORM = {
  accion_id: null,
  socio_nuevo_id: null,
  tipo: null,
  observacion: '',
  monto: '',
};

const TIPOS = [
  { value: 'FAMILIAR', label: 'Familiar' },
  { value: 'AJENO', label: 'Ajeno' },
];

export default function CambioNombreModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [acciones, setAcciones] = useState([]);
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(false);
  const { submitting, run } = useAsyncSubmit();

  useEffect(() => {
    if (!open) return;

    setForm(EMPTY_FORM);
    setErrors({});
    setLoading(true);

    Promise.all([
      CambioNombreServices.getAcciones(),
      CambioNombreServices.getSocios(),
    ]).then(([accionesResponse, sociosResponse]) => {
      setLoading(false);

      if (!accionesResponse.ok || !sociosResponse.ok) {
        toast.error(accionesResponse.message || sociosResponse.message);
        return;
      }

      setAcciones(accionesResponse.data ?? []);
      setSocios(sociosResponse.data ?? []);
    });
  }, [open]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateCambioNombre(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }

    await run(() => CambioNombreServices.create(validation.data), {
      successMessage: (res) => res?.message || 'Cambio de nombre registrado',
      errorMessage: 'No se pudo registrar el cambio de nombre',
      onSuccess: async () => {
        await onSaved?.();
        onClose();
      },
    });
  };

  return (
    <FormModal
      open={open}
      title="Cambio de nombre de acción"
      description="Transfiere una acción a un nuevo socio."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <SelectComponent
          label="Acción"
          name="accion_id"
          value={form.accion_id}
          onChange={handleChange}
          options={acciones}
          error={errors.accion_id}
          isDisabled={loading}
        />

        <SelectComponent
          label="Nuevo socio"
          name="socio_nuevo_id"
          value={form.socio_nuevo_id}
          onChange={handleChange}
          options={socios}
          error={errors.socio_nuevo_id}
          isDisabled={loading}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectComponent
            label="Tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            options={TIPOS}
            error={errors.tipo}
          />

          <ElegantInput
            label="Monto"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            error={errors.monto}
            placeholder="0"
            required
          />
        </div>

        <ElegantTextarea
          label="Observación"
          name="observacion"
          value={form.observacion}
          onChange={handleChange}
          error={errors.observacion}
          rows={3}
          placeholder="Motivo del cambio de nombre"
          required
        />

        <ModalFooter
          onCancel={onClose}
          saving={submitting || loading}
          submitLabel="Registrar cambio"
          savingLabel={loading ? 'Cargando...' : 'Procesando...'}
        />
      </form>
    </FormModal>
  );
}
