import {
  ArrowPathIcon,
  CheckCircleIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  MODALS,
  useModalManager,
} from '../../../hooks/useModalManager';

import ConfirmModal from '../../../components/ConfirmModal';
import InputField from '../../../components/ElegantInput';

import { toast } from 'react-toastify';

import { useEffect, useState } from 'react';

import { getChangedFields } from '../../../utils/getChangedFields';

import { tipoAccionSchema } from '../tipoaccion.schema';

import { TipoAccionServices as Servs } from '../tipoAccion.services';

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
   * Formulario actual.
   */
  const [form, setForm] = useState(
    initialForm(),
  );

  /**
   * Copia de los datos originales.
   *
   * Se utiliza para comparar cambios
   * cuando estamos editando.
   */
  const [originalForm, setOriginalForm] =
    useState(null);

  /**
   * Payload validado que finalmente
   * mandaremos al backend.
   */
  const [payload, setPayload] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const {
    openModal,
    closeModal,
    isModalOpen,
  } = useModalManager();

  /**
   * ============================================================
   * CARGAR DATOS AL ABRIR EL MODAL
   * ============================================================
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
    if (isEdit && dataRow) {
      const initialData = {
        nombre_tipo_accion:
          dataRow.nombre_tipo_accion || '',
      };

      setForm(initialData);

      setOriginalForm(initialData);

      return;
    }

    /**
     * CREAR
     */
    setForm(initialForm());

    setOriginalForm(null);
  }, [
    open,
    isEdit,
    dataRow,
  ]);

  if (!open) {
    return null;
  }

  /**
   * ============================================================
   * CAMBIO DE INPUT
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

    setErrors((previous) => ({
      ...previous,

      [name]: null,
    }));
  };

  /**
   * ============================================================
   * VALIDACIÓN
   * ============================================================
   */
  const handleValidation = () => {
    /**
     * CREATE:
     *
     * {
     *   nombre_tipo_accion: '...'
     * }
     *
     * EDIT:
     *
     * Solo campos modificados.
     */
    const dataToValidate = isEdit
      ? getChangedFields(
          originalForm,
          form,
        )
      : form;

    /**
     * No tiene sentido llamar al backend
     * si no hubo cambios.
     */
    if (
      isEdit &&
      Object.keys(dataToValidate).length === 0
    ) {
      toast.info(
        'No realizaste ningún cambio',
      );

      return;
    }

    /**
     * Validación con Zod.
     */
    const result =
      tipoAccionSchema.safeParse(
        dataToValidate,
      );

    if (!result.success) {
      setErrors(
        result.error.flatten().fieldErrors,
      );

      toast.error(
        'Revise los datos ingresados',
      );

      return;
    }

    /**
     * Guardamos los datos ya validados.
     */
    setPayload(result.data);

    /**
     * Abrimos confirmación.
     */
    openModal(MODALS.CONFIRM);
  };

  /**
   * ============================================================
   * GUARDAR
   * ============================================================
   */
  const handleSubmit = async () => {
    if (!payload) {
      return;
    }

    try {
      setLoading(true);

      const response = isEdit
        ? await Servs.update(
            dataRow.id,
            payload,
          )
        : await Servs.create(
            payload,
          );

      if (!response?.ok) {
        toast.error(
          response?.message ||
            'Error al guardar el tipo de acción',
        );

        closeModal(
          MODALS.CONFIRM,
        );

        return;
      }

      toast.success(
        response?.message ||
          (isEdit
            ? 'Tipo de acción actualizado correctamente'
            : 'Tipo de acción registrado correctamente'),
      );

      closeModal(
        MODALS.CONFIRM,
      );

      onSuccess();
    } catch (error) {
      toast.error(
        error?.message ||
          'Error inesperado al guardar',
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
   * TECLADO
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropKeyDown}
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

                  <span>/</span>

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
                  Ingrese el nombre que identificará
                  al tipo de acción.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
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
                  onChange={handleChange}
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

      {/* ================= CONFIRMACIÓN ================= */}

      <ConfirmModal
        open={isModalOpen(
          MODALS.CONFIRM,
        )}
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