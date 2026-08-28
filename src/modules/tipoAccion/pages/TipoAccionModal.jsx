import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  CheckCircleIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  toast,
} from 'react-toastify';

import {
  MODALS,
  useModalManager,
} from '../../../hooks/useModalManager';

import ConfirmModal
  from '../../../components/ConfirmModal';

import InputField
  from '../../../components/ElegantInput';

import {
  getChangedFields,
} from '../../../utils/getChangedFields';

import {
  TipoAccionServices as Servs,
} from '../services/tipoAccion.services';

/**
 * ============================================================
 * FUNCIONES DEL SCHEMA
 * ============================================================
 *
 * El JSX NO importa los schemas directamente.
 *
 * Solamente funciones ya preparadas.
 */
import {
  validateTipoAccion,
  validateTipoAccionId,
  validateUpdateTipoAccion,
} from '../schema/tipoaccion.schema';

/**
 * ============================================================
 * FORMULARIO INICIAL
 * ============================================================
 */
const initialForm = () => ({
  nombre_tipo_accion: '',
});

export default function TipoAccionModal({
  open,
  onClose,
  dataRow,
  onSuccess,
  isEdit = false,
}) {
  /**
   * ============================================================
   * FORMULARIO ACTUAL
   * ============================================================
   */
  const [
    form,
    setForm,
  ] = useState(
    initialForm(),
  );

  /**
   * ============================================================
   * FORMULARIO ORIGINAL
   * ============================================================
   *
   * Solamente lo necesitamos cuando
   * estamos editando.
   *
   * Nos permitirá saber si realmente
   * se modificó algún campo.
   */
  const [
    originalForm,
    setOriginalForm,
  ] = useState(null);

  /**
   * ============================================================
   * PAYLOAD VALIDADO
   * ============================================================
   *
   * Aquí guardaremos solamente
   * datos que ya pasaron Zod.
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
   * MODALES
   * ============================================================
   */
  const {
    openModal,
    closeModal,
    isModalOpen,
  } = useModalManager();

  /**
   * ============================================================
   * CARGAR DATOS
   * ============================================================
   */
  useEffect(() => {
    if (
      !open
    ) {
      return;
    }

    /**
     * Cada vez que abrimos:
     *
     * limpiamos errores
     * +
     * limpiamos payload.
     */
    setErrors({});

    setPayload(null);

    /**
     * ==========================================================
     * EDITAR
     * ==========================================================
     */
    if (
      isEdit &&
      dataRow
    ) {
      const initialData = {
        nombre_tipo_accion:
          dataRow.nombre_tipo_accion ??
          '',
      };

      /**
       * Mostramos datos actuales.
       */
      setForm(
        initialData,
      );

      /**
       * Guardamos copia original.
       */
      setOriginalForm(
        initialData,
      );

      return;
    }

    /**
     * ==========================================================
     * CREAR
     * ==========================================================
     */
    setForm(
      initialForm(),
    );

    setOriginalForm(
      null,
    );

  }, [
    open,
    isEdit,
    dataRow,
  ]);

  /**
   * ============================================================
   * CAMBIO DE INPUT
   * ============================================================
   */
  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    /**
     * Actualizamos solamente
     * el campo modificado.
     */
    setForm(
      (previous) => ({
        ...previous,

        [name]:
          value,
      }),
    );

    /**
     * Eliminamos solamente
     * el error de ese campo.
     */
    setErrors(
      (previous) => ({
        ...previous,

        [name]:
          undefined,
      }),
    );
  };

  /**
   * ============================================================
   * VALIDAR
   * ============================================================
   */
  const handleValidation = () => {
    /**
     * ==========================================================
     * PASO 1
     * OBTENER DATOS A VALIDAR
     * ==========================================================
     *
     * CREATE:
     *
     * utilizamos todo el formulario.
     *
     * EDIT:
     *
     * solamente campos modificados.
     */
    const dataToValidate =
      isEdit
        ? getChangedFields(
            originalForm,
            form,
          )
        : form;

    /**
     * ==========================================================
     * PASO 2
     * VERIFICAR CAMBIOS
     * ==========================================================
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
     * ==========================================================
     * PASO 3
     * VALIDAR MEDIANTE FUNCIÓN DEL SCHEMA
     * ==========================================================
     *
     * Ya NO hacemos:
     *
     * tipoAccionSchema.safeParse()
     */
    const validation =
      isEdit
        ? validateUpdateTipoAccion(
            dataToValidate,
          )
        : validateTipoAccion(
            dataToValidate,
          );

    /**
     * ==========================================================
     * PASO 4
     * ERROR DE VALIDACIÓN
     * ==========================================================
     */
    if (
      !validation.isValid
    ) {
      setErrors(
        validation.errors,
      );

      toast.error(
        'Revise los datos ingresados',
      );

      return;
    }

    /**
     * ==========================================================
     * PASO 5
     * PAYLOAD CORRECTO
     * ==========================================================
     *
     * validation.data contiene:
     *
     * {
     *   nombre_tipo_accion:
     *     'Tipo Acción'
     * }
     *
     * ya limpio y validado.
     */
    setPayload(
      validation.data,
    );

    /**
     * ==========================================================
     * PASO 6
     * CONFIRMACIÓN
     * ==========================================================
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
     * Protección.
     *
     * Si no existe payload,
     * todavía no se validó.
     */
    if (
      !payload
    ) {
      return;
    }

    /**
     * ==========================================================
     * VALIDAR ID EN EDICIÓN
     * ==========================================================
     */
    let tipoAccionId =
      null;

    if (
      isEdit
    ) {
      const idValidation =
        validateTipoAccionId(
          dataRow?.id,
        );

      if (
        !idValidation.isValid
      ) {
        toast.error(
          idValidation.error,
        );

        closeModal(
          MODALS.CONFIRM,
        );

        return;
      }

      tipoAccionId =
        idValidation.data;
    }

    try {
      setLoading(
        true,
      );

      /**
       * ========================================================
       * CREATE / UPDATE
       * ========================================================
       */
      const response =
        isEdit
          ? await Servs.update(
              tipoAccionId,
              payload,
            )
          : await Servs.create(
              payload,
            );

      /**
       * ========================================================
       * ERROR DEL BACKEND
       * ========================================================
       */
      if (
        !response?.ok
      ) {
        toast.error(
          response?.message ||
            'Error al guardar el tipo de acción',
        );

        closeModal(
          MODALS.CONFIRM,
        );

        return;
      }

      /**
       * ========================================================
       * ÉXITO
       * ========================================================
       */
      toast.success(
        response?.message ||
          (
            isEdit
              ? 'Tipo de acción actualizado correctamente'
              : 'Tipo de acción registrado correctamente'
          ),
      );

      /**
       * Cerramos confirmación.
       */
      closeModal(
        MODALS.CONFIRM,
      );

      /**
       * Avisamos al Page.
       */
      onSuccess?.();

    } catch (error) {
      toast.error(
        error?.message ||
          'Error inesperado al guardar',
      );

    } finally {
      setLoading(
        false,
      );
    }
  };

  /**
   * ============================================================
   * CLICK FUERA
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
   * ESCAPE
   * ============================================================
   */
  const handleBackdropKeyDown = (
    event,
  ) => {
    if (
      event.key ===
        'Escape' &&
      !loading
    ) {
      event.preventDefault();

      onClose();
    }
  };

  /**
   * ============================================================
   * SI ESTÁ CERRADO
   * ============================================================
   */
  if (
    !open
  ) {
    return null;
  }

  return (
    <>
      {/* ======================================================
          MODAL PRINCIPAL
          ====================================================== */}

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
        onClick={
          handleBackdropClick
        }
        onKeyDown={
          handleBackdropKeyDown
        }
        role="presentation"
      >

        <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* ================= ENCABEZADO ================= */}

          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

            <div className="flex items-start gap-4">

              <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">

                <TagIcon className="h-6 w-6" />

              </div>

              <div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                  <span>
                    Tipos de acción
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
                    ? 'Editar tipo de acción'
                    : 'Registrar tipo de acción'}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Ingrese el nombre que identificará al tipo de acción.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                loading
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
              aria-label="Cerrar"
            >

              <XMarkIcon className="h-5 w-5" />

            </button>

          </div>

          {/* ================= CONTENIDO ================= */}

          <div className="max-h-[calc(92vh-90px)] overflow-y-auto">

            <div className="space-y-6 p-6">

              <section>

                <InputField
                  label="Nombre del tipo de acción"
                  type="text"
                  name="nombre_tipo_accion"
                  value={
                    form.nombre_tipo_accion
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Ej. Acción domiciliaria"
                  error={
                    errors.nombre_tipo_accion
                  }
                />

              </section>

            </div>

            {/* ================= BOTONES ================= */}

            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                disabled={
                  loading
                }
                onClick={
                  onClose
                }
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={
                  loading
                }
                onClick={
                  handleValidation
                }
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

                    {isEdit
                      ? 'Guardar cambios'
                      : 'Registrar tipo'}
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          CONFIRMACIÓN
          ====================================================== */}

      <ConfirmModal
        open={
          isModalOpen(
            MODALS.CONFIRM,
          )
        }
        title={
          isEdit
            ? 'Editar tipo de acción'
            : 'Registrar tipo de acción'
        }
        message={
          isEdit
            ? '¿Deseas guardar los cambios realizados?'
            : '¿Deseas registrar este tipo de acción?'
        }
        confirmText={
          isEdit
            ? 'Sí, editar'
            : 'Sí, registrar'
        }
        cancelText="Cancelar"
        loading={
          loading
        }
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