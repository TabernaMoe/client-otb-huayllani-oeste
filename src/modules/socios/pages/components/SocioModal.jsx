import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SocioServices as Servs } from '../../services/socio.services';
import Select from '../../../../components/Select';
import InputField from '../../../../components/ElegantInput';
import Textarea from '../../../../components/ElegantTextarea';
import ConfirmModal from '../../../../components/ConfirmModal';
import { MODALS, useModalManager } from '../../../../hooks/useModalManager';
import { socioSchema, updateSocioSchema } from '../../schema/socio.schema';

const initialForm = () => ({
  ci_socio: '',
  ci_expedido_socio: '',
  nombres_socio: '',
  primer_apellido_socio: '',
  segundo_apellido_socio: '',
  numero_celular_socio: '',
  numero_telefono_socio: '',
  genero_socio: '',
  estado_socio: '',
  direccion_socio: '',
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
const opcionesEstadoAccion = [
  { value: 'HABILITADO', label: 'Habilitado' },
  { value: 'DESHABILITADO', label: 'Deshabilitado' },
];

export default function SocioModal({
  open,
  onClose,
  socio,
  onSuccess,
  isEdit = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [dataSocio, setDataSocio] = useState(null);
  const { modalState, openModal, closeModal, isModalOpen } = useModalManager();

  useEffect(() => {
    setError({});
    if (socio) {
      console.log(socio);
      setForm(socio);
    } else {
      setForm(initialForm());
    }
  }, [socio, open]);

  if (!open) return null;

  const getChangedFields = (original, current) => {
    const changes = {};

    Object.keys(current).forEach((key) => {
      const originalValue = original?.[key] ?? '';
      const currentValue = current?.[key] ?? '';

      if (String(originalValue).trim() !== String(currentValue).trim()) {
        changes[key] = current[key];
      }
    });

    return changes;
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = isEdit
        ? await Servs.update(socio.id, dataSocio)
        : await Servs.create(dataSocio);

      if (!response.ok) {
        toast.error(response.message || 'Error al guardar');
        closeModal();
        return;
      }
      toast.success(
        isEdit
          ? 'Socio actualizado correctamente'
          : 'Socio registrado correctamente',
      );
      closeModal();
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
        {/* Overlay (fondo) */}
        <div
          onClick={loading ? undefined : onClose}
          className="absolute inset-0 bg-black/40"
        />
        <div
          className="relative z-10 w-300 rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
                max-h-[calc(100vh-2rem)] overflow-y-auto"
        >
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? 'Editar registro' : 'Crear nuevo registro'}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 ">
              <div className="md:col-span-1 lg:col-span-3">
                <InputField
                  label="Ingrese cedula de identidad"
                  type="number"
                  name="ci_socio"
                  value={form?.ci_socio || ''}
                  onChange={handleChange}
                  error={error.ci_socio}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <Select
                  label="Expedido en"
                  name={'ci_expedido_socio'}
                  value={form.ci_expedido_socio}
                  onChange={handleChange}
                  options={opcionesDepartamento}
                  error={error.ci_expedido_socio}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <InputField
                  label="Ingrese nombres"
                  type="text"
                  name="nombres_socio"
                  value={form?.nombres_socio || ''}
                  onChange={handleChange}
                  error={error.nombres_socio}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <InputField
                  label="Ingrese primer apellido"
                  type="text"
                  name="primer_apellido_socio"
                  value={form?.primer_apellido_socio || ''}
                  onChange={handleChange}
                  error={error.primer_apellido_socio}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <InputField
                  label="Ingrese segundo apellido"
                  type="text"
                  name="segundo_apellido_socio"
                  value={form?.segundo_apellido_socio || ''}
                  onChange={handleChange}
                  error={error.segundo_apellido_socio}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <InputField
                  label="Ingrese numero de celular"
                  type="number"
                  name="numero_celular_socio"
                  value={form?.numero_celular_socio || ''}
                  onChange={handleChange}
                  error={error.numero_celular_socio}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <InputField
                  label="Ingrese numero de telefono"
                  type="number"
                  name="numero_telefono_socio"
                  value={form?.numero_telefono_socio || ''}
                  onChange={handleChange}
                  error={error.numero_telefono_socio}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <Select
                  label="Seleccione genero"
                  name={'genero_socio'}
                  value={form.genero_socio}
                  onChange={handleChange}
                  options={opcionesGenero}
                  error={error.genero_socio}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <Select
                  label="Seleccione estado del socio"
                  name={'estado_socio'}
                  value={form.estado_socio}
                  onChange={handleChange}
                  options={opcionesEstadoAccion}
                  error={error.estado_socio}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-9">
                <InputField
                  label="Ingrese direccion del socio"
                  type="text"
                  name="direccion_socio"
                  value={form?.direccion_socio || ''}
                  onChange={handleChange}
                  error={error.direccion_socio}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-5">
            <button
              className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="rounded-xl bg-sky-800 px-3 py-2 text-white hover:bg-sky-900"
              onClick={handleValidation}
            >
              {isEdit ? 'Editar cambios' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={isModalOpen(MODALS.CONFIRM)}
        title={isEdit ? 'Editar registro' : 'Guardar registro'}
        message="¿Deseas continuar?"
        confirmText={isEdit ? 'Sí, editar' : 'Sí, guardar'}
        cancelText="Cancelar"
        loading={loading}
        onClose={closeModal}
        onConfirm={handleSubmit}
      />
    </>
  );
}
