import { useEffect, useState } from 'react';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  IdentificationIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
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
        ci_expedido:
          socio.ci_expedido ||
          socio.ci_expedido_socio ||
          '',
        nombres:
          socio.nombres ||
          socio.nombres_socio ||
          '',
        primer_apellido:
          socio.primer_apellido ||
          socio.primer_apellido_socio ||
          '',
        segundo_apellido:
          socio.segundo_apellido ||
          socio.segundo_apellido_socio ||
          '',
        numero_celular:
          socio.numero_celular ||
          socio.numero_celular_socio ||
          '',
        genero:
          socio.genero ||
          socio.genero_socio ||
          '',
        direccion:
          socio.direccion ||
          socio.direccion_socio ||
          '',
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

      if (
        String(originalValue).trim() !==
        String(currentValue).trim()
      ) {
        changes[key] = current[key];
      }
    });

    return changes;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError((previous) => ({
      ...previous,
      [name]: null,
    }));
  };

  const getFieldErrors = (error) =>
    error.issues.reduce((acc, issue) => {
      const [field] = issue.path;

      if (!field) return acc;

      if (!acc[field]) {
        acc[field] = [];
      }

      acc[field].push(issue.message);
      return acc;
    }, {});

  const handleValidation = () => {
    const payload = isEdit
      ? getChangedFields(socio, form)
      : form;

    if (isEdit && Object.keys(payload).length === 0) {
      toast.info('No realizaste ningún cambio');
      return;
    }

    const result = isEdit
      ? updateSocioSchema.safeParse(payload)
      : socioSchema.safeParse(payload);

    if (!result.success) {
        setError(getFieldErrors(result.error));
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

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !loading) {
      onClose();
    }
  };

  const handleBackdropKeyDown = (event) => {
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      event.target === event.currentTarget &&
      !loading
    ) {
      event.preventDefault();
      onClose();
    }

    if (event.key === 'Escape' && !loading) {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <>
      <button
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
        aria-label="Cerrar modal"
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropKeyDown}
        type="button"
      >
        <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
                <UsersIcon className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span>Socios</span>
                  <span>/</span>
                  <span className="text-emerald-700">
                    {isEdit ? 'Editar' : 'Nuevo'}
                  </span>
                </div>

                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  {isEdit
                    ? 'Editar información del socio'
                    : 'Registrar nuevo socio'}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Completa los datos personales y de contacto.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(92vh-90px)] overflow-y-auto">
            <div className="space-y-6 p-6">
              <section>
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    1
                  </span>

                  <div>
                    <h4 className="font-bold text-slate-900">
                      Identificación personal
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Ingresa los datos de identificación del socio.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <InputWrapper icon={IdentificationIcon}>
                    <InputField
                      label="Cédula de identidad"
                      type="number"
                      name="ci_socio"
                      value={form.ci_socio}
                      onChange={handleChange}
                      error={error.ci_socio}
                    />
                  </InputWrapper>

                  <Select
                    label="Expedido en"
                    name="ci_expedido"
                    value={form.ci_expedido}
                    onChange={handleChange}
                    options={opcionesDepartamento}
                    error={error.ci_expedido}
                  />

                  <InputWrapper icon={UserIcon}>
                    <InputField
                      label="Nombres"
                      type="text"
                      name="nombres"
                      value={form.nombres}
                      onChange={handleChange}
                      error={error.nombres}
                    />
                  </InputWrapper>

                  <InputField
                    label="Primer apellido"
                    type="text"
                    name="primer_apellido"
                    value={form.primer_apellido}
                    onChange={handleChange}
                    error={error.primer_apellido}
                  />

                  <InputField
                    label="Segundo apellido"
                    type="text"
                    name="segundo_apellido"
                    value={form.segundo_apellido}
                    onChange={handleChange}
                    error={error.segundo_apellido}
                  />

                  <Select
                    label="Género"
                    name="genero"
                    value={form.genero}
                    onChange={handleChange}
                    options={opcionesGenero}
                    error={error.genero}
                  />
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    2
                  </span>

                  <div>
                    <h4 className="font-bold text-slate-900">
                      Información de contacto
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Registra el celular y la dirección actual.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <InputWrapper icon={PhoneIcon}>
                    <InputField
                      label="Número de celular"
                      type="number"
                      name="numero_celular"
                      value={form.numero_celular}
                      onChange={handleChange}
                      error={error.numero_celular}
                    />
                  </InputWrapper>

                  <div className="md:col-span-2">
                    <InputWrapper icon={MapPinIcon}>
                      <InputField
                        label="Dirección"
                        type="text"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        error={error.direccion}
                      />
                    </InputWrapper>
                  </div>
                </div>
              </section>
            </div>

            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleValidation}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    {isEdit ? 'Guardar cambios' : 'Registrar socio'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </button>

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

function InputWrapper({ children }) {
  return <div>{children}</div>;
}