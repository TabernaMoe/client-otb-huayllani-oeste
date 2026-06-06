import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { SocioServices as Servs } from '../services/socio.services';
import Select from '../../../components/Select';
import InputField from '../../../components/ElegantInput';
import ConfirmModal from '../../../components/ConfirmModal';
import { MODALS, useModalManager } from '../../../hooks/useModalManager';
import { socioSchema, updateSocioSchema } from '../schema/socio.schema';

const initialForm = () => ({
  ci_socio: '',
  ci_expedido: '',
  nombres: '',
  primer_apellido: '',
  segundo_apellido: '',
  numero_celular: '',
  genero: '',
  direccion: '',
});

const opcionesGenero = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
];

const opcionesDepartamento = [
  { value: 'LP', label: 'La Paz' },
  { value: 'CB', label: 'Cochabamba' },
  { value: 'SC', label: 'Santa Cruz' },
  { value: 'OR', label: 'Oruro' },
  { value: 'PT', label: 'Potosí' },
  { value: 'TJ', label: 'Tarija' },
  { value: 'CH', label: 'Chuquisaca' },
  { value: 'BN', label: 'Beni' },
  { value: 'PD', label: 'Pando' },
];

export default function SocioModal({
  open,
  onClose,
  socio,
  onSuccess,
  isEdit = false,
}) {
  const [form, setForm] = useState(initialForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [dataSocio, setDataSocio] = useState(null);

  const { openModal, closeModal, isModalOpen } = useModalManager();

  useEffect(() => {
    setError({});

    if (socio) {
      setForm({
        ci_socio: socio.ci_socio || '',
        ci_expedido: socio.ci_expedido || socio.ci_expedido_socio || '',
        nombres: socio.nombres || socio.nombres_socio || '',
        primer_apellido:
          socio.primer_apellido || socio.primer_apellido_socio || '',
        segundo_apellido:
          socio.segundo_apellido || socio.segundo_apellido_socio || '',
        numero_celular:
          socio.numero_celular || socio.numero_celular_socio || '',
        genero: socio.genero || socio.genero_socio || '',
        direccion: socio.direccion || socio.direccion_socio || '',
      });
    } else {
      setForm(initialForm());
    }
  }, [socio, open]);

  if (!open) return null;

  const getChangedFields = (original, current) => {
    const changes = {};

    Object.keys(current).forEach((key) => {
      const originalValue =
        original?.[key] ??
        original?.[`${key}_socio`] ??
        '';

      const currentValue = current?.[key] ?? '';

      if (String(originalValue).trim() !== String(currentValue).trim()) {
        changes[key] = current[key];
      }
    });

    return changes;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleValidation = () => {
    const payload = isEdit ? getChangedFields(socio, form) : form;

    if (isEdit && Object.keys(payload).length === 0) {
      toast.info('No realizaste ningún cambio');
      return;
    }

    const result = isEdit
      ? updateSocioSchema.safeParse(payload)
      : socioSchema.safeParse(payload);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }

    setDataSocio(result.data);
    openModal(MODALS.CONFIRM);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = isEdit
        ? await Servs.update(socio.id, dataSocio)
        : await Servs.create(dataSocio);

      if (!response.ok) {
        toast.error(response.message || 'Error al guardar');
        closeModal(MODALS.CONFIRM);
        return;
      }

      toast.success(
        isEdit
          ? 'Socio actualizado correctamente'
          : 'Socio registrado correctamente',
      );

      closeModal(MODALS.CONFIRM);
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={loading ? undefined : onClose}
          className="absolute inset-0 bg-black/40"
        />

        <div className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-7xl overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? 'Editar socio' : 'Crear nuevo socio'}
            </h3>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200 disabled:opacity-60"
            >
              X
            </button>
          </div>

          <div className="mb-2 rounded-xl bg-white p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <InputField
                  label="Cédula de identidad"
                  type="number"
                  name="ci_socio"
                  value={form.ci_socio}
                  onChange={handleChange}
                  error={error.ci_socio}
                />
              </div>

              <div className="lg:col-span-3">
                <Select
                  label="Expedido en"
                  name="ci_expedido"
                  value={form.ci_expedido}
                  onChange={handleChange}
                  options={opcionesDepartamento}
                  error={error.ci_expedido}
                />
              </div>

              <div className="lg:col-span-3">
                <InputField
                  label="Nombres"
                  type="text"
                  name="nombres"
                  value={form.nombres}
                  onChange={handleChange}
                  error={error.nombres}
                />
              </div>

              <div className="lg:col-span-3">
                <InputField
                  label="Primer apellido"
                  type="text"
                  name="primer_apellido"
                  value={form.primer_apellido}
                  onChange={handleChange}
                  error={error.primer_apellido}
                />
              </div>

              <div className="lg:col-span-3">
                <InputField
                  label="Segundo apellido"
                  type="text"
                  name="segundo_apellido"
                  value={form.segundo_apellido}
                  onChange={handleChange}
                  error={error.segundo_apellido}
                />
              </div>

              <div className="lg:col-span-3">
                <InputField
                  label="Número de celular"
                  type="number"
                  name="numero_celular"
                  value={form.numero_celular}
                  onChange={handleChange}
                  error={error.numero_celular}
                />
              </div>

              <div className="lg:col-span-3">
                <Select
                  label="Género"
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  options={opcionesGenero}
                  error={error.genero}
                />
              </div>

              <div className="lg:col-span-9">
                <InputField
                  label="Dirección"
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  error={error.direccion}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 p-5">
            <button
              type="button"
              disabled={loading}
              className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900 disabled:opacity-60"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={loading}
              className="rounded-xl bg-sky-800 px-3 py-2 text-white hover:bg-sky-900 disabled:opacity-60"
              onClick={handleValidation}
            >
              {isEdit ? 'Editar cambios' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={isModalOpen(MODALS.CONFIRM)}
        title={isEdit ? 'Editar socio' : 'Guardar socio'}
        message="¿Deseas continuar?"
        confirmText={isEdit ? 'Sí, editar' : 'Sí, guardar'}
        cancelText="Cancelar"
        loading={loading}
        onClose={() => closeModal(MODALS.CONFIRM)}
        onConfirm={handleSubmit}
      />
    </>
  );
}