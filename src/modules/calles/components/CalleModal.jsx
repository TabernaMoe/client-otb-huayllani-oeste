import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  CheckCircleIcon,
  MapPinIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  toast,
} from 'react-toastify';

import {
  CallesServices as Servs,
} from '../services/calles.services';

import InputField
  from '../../../components/ElegantInput';

/**
 * ============================================================
 * IMPORTAMOS LAS FUNCIONES DE VALIDACIÓN
 * ============================================================
 *
 * El JSX no sabe cómo funciona Zod.
 */
import {
  validateCalle,
  validateCalleId,
  validateUpdateCalle,
} from '../schema/calles.schema';

/**
 * ============================================================
 * FORMULARIO INICIAL
 * ============================================================
 */
const initialForm = {
  nombre_calle: '',
};

export default function CalleModal({
  open,
  calle,
  onClose,
  onSuccess,
}) {
  /**
   * ============================================================
   * SABER SI ESTAMOS EDITANDO
   * ============================================================
   */
  const isEdit =
    Boolean(
      calle,
    );

  /**
   * ============================================================
   * FORMULARIO
   * ============================================================
   */
  const [
    form,
    setForm,
  ] = useState(
    initialForm,
  );

  /**
   * ============================================================
   * ERRORES
   * ============================================================
   *
   * Ejemplo:
   *
   * {
   *   nombre_calle:
   *     'El nombre de la calle es obligatorio'
   * }
   */
  const [
    errors,
    setErrors,
  ] = useState({});

  /**
   * ============================================================
   * LOADING
   * ============================================================
   */
  const [
    loading,
    setLoading,
  ] = useState(false);

  /**
   * ============================================================
   * MENSAJE DE ERROR DEL BACKEND
   * ============================================================
   */
  const [
    message,
    setMessage,
  ] = useState('');

  /**
   * ============================================================
   * CARGAR FORMULARIO
   * ============================================================
   */
  useEffect(() => {
    if (
      !open
    ) {
      return;
    }

    /**
     * Limpiamos errores.
     */
    setErrors({});

    setMessage('');

    /**
     * ==========================================================
     * EDITAR
     * ==========================================================
     */
    if (
      calle
    ) {
      setForm({
        nombre_calle:
          calle.nombre_calle ||
          '',
      });

      return;
    }

    /**
     * ==========================================================
     * CREAR
     * ==========================================================
     */
    setForm(
      initialForm,
    );

  }, [
    open,
    calle,
  ]);

  /**
   * ============================================================
   * CAMBIAR INPUT
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
     * Actualizamos el campo.
     */
    setForm(
      (previous) => ({
        ...previous,

        [name]:
          value,
      }),
    );

    /**
     * Limpiamos solamente
     * el error del campo modificado.
     */
    setErrors(
      (previous) => ({
        ...previous,

        [name]:
          undefined,
      }),
    );

    /**
     * Limpiamos mensaje general.
     */
    setMessage('');
  };

  /**
   * ============================================================
   * GUARDAR
   * ============================================================
   */
  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    /**
     * ==========================================================
     * PASO 1
     * VALIDAMOS FORMULARIO
     * ==========================================================
     *
     * CREATE:
     *
     * validateCalle()
     *
     * EDIT:
     *
     * validateUpdateCalle()
     */
    const validation =
      isEdit
        ? validateUpdateCalle(
            form,
          )
        : validateCalle(
            form,
          );

    /**
     * ==========================================================
     * PASO 2
     * ERROR DE VALIDACIÓN
     * ==========================================================
     */
    if (
      !validation.isValid
    ) {
      setErrors(
        validation.errors,
      );

      return;
    }

    /**
     * ==========================================================
     * PASO 3
     * SI EDITAMOS, VALIDAMOS ID
     * ==========================================================
     */
    let calleId = null;

    if (
      isEdit
    ) {
      const idValidation =
        validateCalleId(
          calle?.id,
        );

      if (
        !idValidation.isValid
      ) {
        setMessage(
          idValidation.error,
        );

        return;
      }

      calleId =
        idValidation.data;
    }

    try {
      setLoading(
        true,
      );

      setMessage('');

      /**
       * ========================================================
       * PASO 4
       * PAYLOAD VALIDADO
       * ========================================================
       *
       * IMPORTANTE:
       *
       * NO enviamos:
       *
       * form
       *
       * enviamos:
       *
       * validation.data
       *
       * porque Zod ya hizo:
       *
       * trim()
       * validaciones
       * transformaciones
       */
      const payload =
        validation.data;

      /**
       * ========================================================
       * PASO 5
       * CREATE / UPDATE
       * ========================================================
       */
      const response =
        isEdit

          ? await Servs.update(
              calleId,
              payload,
            )

          : await Servs.create(
              payload,
            );

      /**
       * ========================================================
       * PASO 6
       * ERROR DEL BACKEND
       * ========================================================
       */
      if (
        !response?.ok
      ) {
        setMessage(
          response?.message ||
            'No se pudo guardar la calle',
        );

        return;
      }

      /**
       * ========================================================
       * PASO 7
       * ÉXITO
       * ========================================================
       */
      toast.success(
        response?.message ||
          (
            isEdit
              ? 'Calle actualizada correctamente'
              : 'Calle creada correctamente'
          ),
      );

      /**
       * Avisamos a CallesPage.
       */
      onSuccess?.();

    } catch (error) {
      setMessage(
        error?.message ||
          'Error inesperado al guardar la calle',
      );

    } finally {
      setLoading(
        false,
      );
    }
  };

  /**
   * ============================================================
   * CERRAR
   * ============================================================
   */
  const handleClose = () => {
    if (
      loading
    ) {
      return;
    }

    onClose();
  };

  /**
   * Si está cerrado,
   * no renderizamos nada.
   */
  if (
    !open
  ) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[2px]"
      onMouseDown={(
        event,
      ) => {
        /**
         * Cerramos solamente
         * si hacemos click en el fondo.
         */
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >

      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ====================================================
            HEADER
            ==================================================== */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-start gap-4">

            <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">

              <MapPinIcon className="h-6 w-6" />

            </div>

            <div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                <span>
                  Calles
                </span>

                <span>
                  /
                </span>

                <span className="text-emerald-700">
                  {isEdit
                    ? 'Editar'
                    : 'Nueva'}
                </span>

              </div>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {isEdit
                  ? 'Editar calle'
                  : 'Registrar calle'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isEdit
                  ? 'Actualiza el nombre de la calle.'
                  : 'Registra una nueva calle para el sistema.'}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={
              handleClose
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

        {/* ====================================================
            MENSAJE BACKEND
            ==================================================== */}

        {message && (
          <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {message}
          </div>
        )}

        {/* ====================================================
            FORMULARIO
            ==================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="p-6">

            <InputField
              label="Nombre de la calle"
              type="text"
              name="nombre_calle"
              value={
                form.nombre_calle
              }
              onChange={
                handleChange
              }
              placeholder="Ej. Bolívar"
              error={
                errors.nombre_calle
              }
            />

          </div>

          {/* ==================================================
              FOOTER
              ================================================== */}

          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                loading
              }
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                loading
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
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
                    : 'Registrar calle'}
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}