import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import SelectComponent from '../../../components/Select';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { validateSocio } from '../schema/socio.schema';
import { SocioServices } from '../services/socio.services';

const INITIAL_FORM = {
  ci_socio: '',
  ci_expedido: '',
  nombres: '',
  primer_apellido: '',
  segundo_apellido: '',
  numero_celular: '',
  genero: '',
  direccion: '',
};

const EXPEDIDOS = [
  ['LP', 'La Paz'],
  ['CB', 'Cochabamba'],
  ['SC', 'Santa Cruz'],
  ['OR', 'Oruro'],
  ['PT', 'Potosí'],
  ['TJ', 'Tarija'],
  ['CH', 'Chuquisaca'],
  ['BN', 'Beni'],
  ['PD', 'Pando'],
].map(([value, label]) => ({ value, label }));

const GENEROS = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
];

export default function SocioModal({ open, socio, onClose, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const { submitting, run } = useAsyncSubmit();
  const isEdit = Boolean(socio?.id);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      socio
        ? {
            ci_socio: String(socio.ci_socio ?? ''),
            ci_expedido: socio.ci_expedido ?? '',
            nombres: socio.nombres ?? '',
            primer_apellido: socio.primer_apellido ?? '',
            segundo_apellido: socio.segundo_apellido ?? '',
            numero_celular: String(socio.numero_celular ?? ''),
            genero: socio.genero ?? '',
            direccion: socio.direccion ?? '',
          }
        : INITIAL_FORM,
    );
  }, [open, socio]);

  const handleChange = ({ target }) => {
    setForm((prev) => ({ ...prev, [target.name]: target.value ?? '' }));
    setErrors((prev) => ({ ...prev, [target.name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateSocio(form);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }

    await run(
      () =>
        isEdit
          ? SocioServices.update(socio.id, validation.data)
          : SocioServices.create(validation.data),
      {
        successMessage: (res) =>
          res?.message || (isEdit ? 'Socio actualizado' : 'Socio registrado'),
        errorMessage: 'No se pudo guardar el socio',
        onSuccess: async () => {
          await onSuccess?.();
          onClose();
        },
      },
    );
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar socio' : 'Nuevo socio'}
      description="Información personal y de contacto."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <ElegantInput
            label="CI"
            name="ci_socio"
            value={form.ci_socio}
            onChange={handleChange}
            error={errors.ci_socio}
            required
          />
          <SelectComponent
            label="Expedido"
            name="ci_expedido"
            value={form.ci_expedido}
            onChange={handleChange}
            options={EXPEDIDOS}
            error={errors.ci_expedido}
          />
          <ElegantInput
            label="Nombres"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            error={errors.nombres}
            required
          />
          <ElegantInput
            label="Primer apellido"
            name="primer_apellido"
            value={form.primer_apellido}
            onChange={handleChange}
            error={errors.primer_apellido}
            required
          />
          <ElegantInput
            label="Segundo apellido"
            name="segundo_apellido"
            value={form.segundo_apellido}
            onChange={handleChange}
            error={errors.segundo_apellido}
          />
          <ElegantInput
            label="Celular"
            name="numero_celular"
            value={form.numero_celular}
            onChange={handleChange}
            error={errors.numero_celular}
            required
          />
          <SelectComponent
            label="Género"
            name="genero"
            value={form.genero}
            onChange={handleChange}
            options={GENEROS}
            error={errors.genero}
          />
          <ElegantInput
            label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            error={errors.direccion}
            required
          />
        </div>

        <ModalFooter
          onCancel={onClose}
          saving={submitting}
          submitLabel={isEdit ? 'Guardar cambios' : 'Registrar socio'}
        />
      </form>
    </FormModal>
  );
}
