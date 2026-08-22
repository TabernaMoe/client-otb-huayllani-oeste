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

import {
  MODALS,
  useModalManager,
} from '../../../hooks/useModalManager';

import {
  socioSchema,
  updateSocioSchema,
} from '../schema/socio.schema';

import { getChangedFields } from '../../../utils/getChangedFields';

/**
 * ============================================================
 * FORMULARIO INICIAL
 * ============================================================
 */
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

/**
 * ============================================================
 * OPCIONES DE GÉNERO
 * ============================================================
 */
const opcionesGenero = [
  {
    value: 'MASCULINO',
    label: 'Masculino',
  },
  {
    value: 'FEMENINO',
    label: 'Femenino',
  },
];

/**
 * ============================================================
 * DEPARTAMENTOS
 * ============================================================
 */
const opcionesDepartamento = [
  {
    value: 'LP',
    label: 'La Paz',
  },
  {
    value: 'CB',
    label: 'Cochabamba',
  },
  {
    value: 'SC',
    label: 'Santa Cruz',
  },
  {
    value: 'OR',
    label: 'Oruro',
  },
  {
    value: 'PT',
    label: 'Potosí',
  },
  {
    value: 'TJ',
    label: 'Tarija',
  },
  {
    value: 'CH',
    label: 'Chuquisaca',
  },
  {
    value: 'BN',
    label: 'Beni',
  },
  {
    value: 'PD',
    label: 'Pando',
  },
];

export default function SocioModal({
  open,
  onClose,
  socio,
  onSuccess,
  isEdit = false,
}) {
  /**
   * ============================================================
   * FORMULARIO ACTUAL
   * ============================================================
   */
  const [form, setForm] = useState(
    initialForm(),
  );

  /**
   * Copia de los datos originales.
   *
   * Se utiliza cuando editamos para conocer
   * qué campos realmente cambiaron.
   */
  const [
    originalForm,
    setOriginalForm,
  ] = useState(null);

  /**
   * Datos ya validados que enviaremos
   * al backend.
   */
  const [
    payload,
    setPayload,
  ] = useState(null);

  /**
   * ============================================================
   * ESTADOS
   * ============================================================
   */
  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    errors,
    setErrors,
  ] = useState({});

  /**
   * ============================================================
   * MANEJO DE MODALES
   * ============================================================
   */
  const {
    openModal,
    closeModal,
    isModalOpen,
  } = useModalManager();

  /**
   * ============================================================
   * CARGAR FORMULARIO
   * ============================================================
   *
   * CREATE:
   * formulario vacío.
   *
   * EDIT:
   * cargamos los datos recibidos del socio.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    setErrors({});

    setPayload(null);

    /**
     * EDITAR
     */
    if (isEdit && socio) {
      const initialData = {
        ci_socio:
          String(
            socio.ci_socio ?? '',
          ),

        ci_expedido:
          socio.ci_expedido ?? '',

        nombres:
          socio.nombres ?? '',

        primer_apellido:
          socio.primer_apellido ?? '',

        segundo_apellido:
          socio.segundo_apellido ?? '',

        numero_celular:
          String(
            socio.numero_celular ?? '',
          ),

        genero:
          socio.genero ?? '',

        direccion:
          socio.direccion ?? '',
      };

      setForm(initialData);

      setOriginalForm(initialData);

      return;
    }

    /**
     * CREAR
     */
    setForm(
      initialForm(),
    );

    setOriginalForm(null);
  }, [
    open,
    socio,
    isEdit,
  ]);

  /**
   * Si no está abierto,
   * no renderizamos nada.
   */
  if (!open) {
    return null;
  }

  /**
   * ============================================================
   * CAMBIO DE CAMPOS
   * ============================================================
   */
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: value,
    }));

    /**
     * Eliminamos solamente el error
     * correspondiente al campo modificado.
     */
    setErrors((previous) => ({
      ...previous,

      [name]: undefined,
    }));
  };

  /**
   * ============================================================
   * VALIDACIÓN
   * ============================================================
   */
  const handleValidation = () => {
    /**
     * CREAR:
     *
     * validamos todo el formulario.
     *
     * EDITAR:
     *
     * solamente enviamos los campos
     * realmente modificados.
     */
    const dataToValidate = isEdit
      ? getChangedFields(
          originalForm,
          form,
        )
      : form;

    /**
     * Si estamos editando y no cambió
     * ningún campo, no llamamos al backend.
     */
    if (
      isEdit &&
      Object.keys(
        dataToValidate,
      ).length === 0
    ) {
      toast.info(
        'No realizaste ningún cambio',
      );

      return;
    }

    /**
     * CREATE:
     * socioSchema
     *
     * UPDATE:
     * updateSocioSchema
     */
    const result = isEdit
      ? updateSocioSchema.safeParse(
          dataToValidate,
        )
      : socioSchema.safeParse(
          dataToValidate,
        );

    /**
     * Si Zod encuentra errores.
     */
    if (!result.success) {
      setErrors(
        result.error.flatten()
          .fieldErrors,
      );

      toast.error(
        'Revise los datos ingresados',
      );

      return;
    }

    /**
     * Guardamos únicamente datos
     * que ya pasaron la validación.
     */
    setPayload(
      result.data,
    );

    /**
     * Antes de enviar mostramos
     * confirmación.
     */
    openModal(
      MODALS.CONFIRM,
    );
  };

  /**
   * ============================================================
   * GUARDAR
   * ============================================================
   */
  const handleSubmit = async () => {
    /**
     * Protección adicional.
     *
     * No debería ejecutarse si todavía
     * no existe un payload validado.
     */
    if (!payload) {
      return;
    }

    try {
      setLoading(true);

      /**
       * EDITAR
       */
      const response = isEdit
        ? await Servs.update(
            socio.id,
            payload,
          )

        /**
         * CREAR
         */
        : await Servs.create(
            payload,
          );

      /**
       * Error enviado por backend.
       */
      if (!response?.ok) {
        toast.error(
          response?.message ||
            'Error al guardar el socio',
        );

        closeModal(
          MODALS.CONFIRM,
        );

        return;
      }

      /**
       * Éxito.
       */
      toast.success(
        response?.message ||
          (
            isEdit
              ? 'Socio actualizado correctamente'
              : 'Socio registrado correctamente'
          ),
      );

      /**
       * Cerramos confirmación.
       */
      closeModal(
        MODALS.CONFIRM,
      );

      /**
       * Avisamos a SocioPage que
       * debe cerrar y actualizar tabla.
       */
      onSuccess();
    } catch (error) {
      toast.error(
        error?.message ||
          'Error inesperado al guardar el socio',
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * ============================================================
   * CERRAR HACIENDO CLICK FUERA
   * ============================================================
   */
  const handleBackdropClick = (
    event,
  ) => {
    if (
      event.target ===
        event.currentTarget &&
      !loading
    ) {
      onClose();
    }
  };

  /**
   * ============================================================
   * CERRAR CON ESCAPE
   * ============================================================
   */
  const handleBackdropKeyDown = (
    event,
  ) => {
    if (
      event.key === 'Escape' &&
      !loading
    ) {
      event.preventDefault();

      onClose();
    }
  };

  return (
    <>
      {/* ======================================================
          MODAL PRINCIPAL
          ====================================================== */}

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropKeyDown}
        role="presentation"
      >
        <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* ================= ENCABEZADO ================= */}

          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
                <UsersIcon className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span>
                    Socios
                  </span>

                  <span>
                    /
                  </span>

                  <span className="text-emerald-700">
                    {isEdit
                      ? 'Editar'
                      : 'Nuevo'}
                  </span>
                </div>

                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  {isEdit
                    ? 'Editar información del socio'
                    : 'Registrar nuevo socio'}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Complete los datos personales y de contacto.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Cerrar modal"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* ================= CONTENIDO ================= */}

          <div className="max-h-[calc(92vh-90px)] overflow-y-auto">
            <div className="space-y-8 p-6">

              {/* ============================================
                  SECCIÓN 1
                  IDENTIFICACIÓN
                  ============================================ */}

              <section>
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    1
                  </span>

                  <div>
                    <h4 className="font-bold text-slate-900">
                      Identificación personal
                    </h4>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Ingrese los datos de identificación del socio.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                  {/* CI */}

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <IdentificationIcon className="h-4 w-4" />

                      <span className="text-xs font-medium">
                        Identificación
                      </span>
                    </div>

                    <InputField
                      label="Cédula de identidad"
                      type="text"
                      inputMode="numeric"
                      name="ci_socio"
                      value={
                        form.ci_socio
                      }
                      onChange={
                        handleChange
                      }
                      error={
                        errors.ci_socio
                      }
                    />
                  </div>

                  {/* EXPEDIDO */}

                  <Select
                    label="Expedido en"
                    name="ci_expedido"
                    value={
                      form.ci_expedido
                    }
                    onChange={
                      handleChange
                    }
                    options={
                      opcionesDepartamento
                    }
                    error={
                      errors.ci_expedido
                    }
                  />

                  {/* NOMBRES */}

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <UserIcon className="h-4 w-4" />

                      <span className="text-xs font-medium">
                        Datos personales
                      </span>
                    </div>

                    <InputField
                      label="Nombres"
                      type="text"
                      name="nombres"
                      value={
                        form.nombres
                      }
                      onChange={
                        handleChange
                      }
                      error={
                        errors.nombres
                      }
                    />
                  </div>

                  {/* PRIMER APELLIDO */}

                  <InputField
                    label="Primer apellido"
                    type="text"
                    name="primer_apellido"
                    value={
                      form.primer_apellido
                    }
                    onChange={
                      handleChange
                    }
                    error={
                      errors.primer_apellido
                    }
                  />

                  {/* SEGUNDO APELLIDO */}

                  <InputField
                    label="Segundo apellido"
                    type="text"
                    name="segundo_apellido"
                    value={
                      form.segundo_apellido
                    }
                    onChange={
                      handleChange
                    }
                    error={
                      errors.segundo_apellido
                    }
                  />

                  {/* GÉNERO */}

                  <Select
                    label="Género"
                    name="genero"
                    value={
                      form.genero
                    }
                    onChange={
                      handleChange
                    }
                    options={
                      opcionesGenero
                    }
                    error={
                      errors.genero
                    }
                  />
                </div>
              </section>

              <div className="border-t border-slate-100" />

              {/* ============================================
                  SECCIÓN 2
                  CONTACTO
                  ============================================ */}

              <section>
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    2
                  </span>

                  <div>
                    <h4 className="font-bold text-slate-900">
                      Información de contacto
                    </h4>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Registre el número de celular y la dirección actual.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">

                  {/* CELULAR */}

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <PhoneIcon className="h-4 w-4" />

                      <span className="text-xs font-medium">
                        Contacto
                      </span>
                    </div>

                    <InputField
                      label="Número de celular"
                      type="text"
                      inputMode="numeric"
                      name="numero_celular"
                      value={
                        form.numero_celular
                      }
                      onChange={
                        handleChange
                      }
                      error={
                        errors.numero_celular
                      }
                    />
                  </div>

                  {/* DIRECCIÓN */}

                  <div className="md:col-span-2">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <MapPinIcon className="h-4 w-4" />

                      <span className="text-xs font-medium">
                        Ubicación
                      </span>
                    </div>

                    <InputField
                      label="Dirección"
                      type="text"
                      name="direccion"
                      value={
                        form.direccion
                      }
                      onChange={
                        handleChange
                      }
                      error={
                        errors.direccion
                      }
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* ================= PIE ================= */}

            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={
                  handleValidation
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />

                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />

                    {isEdit
                      ? 'Guardar cambios'
                      : 'Registrar socio'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          MODAL DE CONFIRMACIÓN
          ====================================================== */}

      <ConfirmModal
        open={isModalOpen(
          MODALS.CONFIRM,
        )}
        title={
          isEdit
            ? 'Editar socio'
            : 'Registrar socio'
        }
        message={
          isEdit
            ? '¿Deseas guardar los cambios realizados al socio?'
            : '¿Deseas registrar este nuevo socio?'
        }
        confirmText={
          isEdit
            ? 'Sí, editar'
            : 'Sí, registrar'
        }
        cancelText="Cancelar"
        loading={loading}
        onClose={() =>
          closeModal(
            MODALS.CONFIRM,
          )
        }
        onConfirm={
          handleSubmit
        }
      />
    </>
  );
}