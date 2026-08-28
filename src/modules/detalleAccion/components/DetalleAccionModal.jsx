import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  ReceiptPercentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  toast,
} from 'react-toastify';

import {
  DetalleAccionServices,
} from '../services/detalleAccion.services';

/**
 * ============================================================
 * IMPORTAMOS FUNCIONES DEL SCHEMA
 * ============================================================
 *
 * El modal NO utiliza directamente:
 *
 * safeParse()
 * z.object()
 * z.coerce()
 *
 * Solo consume funciones preparadas.
 */
import {
  validateDetalleAccion,
  validateDetalleAccionId,
  validateUpdateDetalleAccion,
} from '../schema/detalleAccion.schema';

/**
 * ============================================================
 * FORMULARIO INICIAL
 * ============================================================
 */
const initialForm = {
  tipo_accion_id: '',
  nombre_accion: '',
  precio_accion: '',
  tipo_cobro: '',
};

/**
 * ============================================================
 * CLASE DE INPUT
 * ============================================================
 */
const inputClass = (
  hasError = false,
) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
  }`;

export default function DetalleAccionModal({
  open,
  detalle,
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
      detalle,
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
   */
  const [
    errors,
    setErrors,
  ] = useState({});

  /**
   * ============================================================
   * LOADING DE GUARDADO
   * ============================================================
   */
  const [
    loading,
    setLoading,
  ] = useState(false);

  /**
   * ============================================================
   * LOADING DE TIPOS
   * ============================================================
   */
  const [
    loadingTipos,
    setLoadingTipos,
  ] = useState(false);

  /**
   * ============================================================
   * MENSAJE GENERAL
   * ============================================================
   */
  const [
    message,
    setMessage,
  ] = useState('');

  /**
   * ============================================================
   * CATÁLOGO DE TIPOS
   * ============================================================
   */
  const [
    tiposAccion,
    setTiposAccion,
  ] = useState([]);

  /**
   * ============================================================
   * ABRIR MODAL
   * ============================================================
   */
  useEffect(() => {
    if (
      !open
    ) {
      return;
    }

    /**
     * Limpiamos errores anteriores.
     */
    setErrors({});

    setMessage('');

    /**
     * ==========================================================
     * EDITAR
     * ==========================================================
     */
    if (
      detalle
    ) {
      setForm({
        tipo_accion_id:
          detalle.tipo_accion_id ??
          '',

        nombre_accion:
          detalle.nombre_accion ??
          '',

        precio_accion:
          detalle.precio_accion ??
          '',

        tipo_cobro:
          detalle.tipo_cobro ??
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
    detalle,
  ]);

  /**
   * ============================================================
   * CARGAR TIPOS DE ACCIÓN
   * ============================================================
   */
  useEffect(() => {
    if (
      !open
    ) {
      return;
    }

    let cancelled =
      false;

    const fetchTiposAccion =
      async () => {
        try {
          setLoadingTipos(
            true,
          );

          /**
           * GET
           *
           * /admin/accion/detalle/tipos-accion
           */
          const response =
            await DetalleAccionServices.getTiposAccion();

          /**
           * ERROR BACKEND.
           */
          if (
            !response?.ok
          ) {
            toast.error(
              response?.message ||
                'Error al cargar los tipos de acción',
            );

            return;
          }

          /**
           * Evitamos modificar estado
           * si el componente ya fue desmontado.
           */
          if (
            !cancelled
          ) {
            setTiposAccion(
              Array.isArray(
                response.data,
              )
                ? response.data
                : [],
            );
          }

        } catch (error) {
          toast.error(
            error?.message ||
              'Error al cargar los tipos de acción',
          );

        } finally {
          if (
            !cancelled
          ) {
            setLoadingTipos(
              false,
            );
          }
        }
      };

    fetchTiposAccion();

    return () => {
      cancelled =
        true;
    };
  }, [
    open,
  ]);

  /**
   * ============================================================
   * CAMBIO DE INPUTS
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
     * ==========================================================
     * ACTUALIZAR CAMPO
     * ==========================================================
     */
    setForm(
      (previous) => ({
        ...previous,

        [name]:
          value,
      }),
    );

    /**
     * ==========================================================
     * LIMPIAR ERROR DE ESE CAMPO
     * ==========================================================
     */
    setErrors(
      (previous) => ({
        ...previous,

        [name]:
          undefined,
      }),
    );

    setMessage('');
  };

  /**
   * ============================================================
   * CERRAR
   * ============================================================
   */
  const handleClose = () => {
    /**
     * No permitimos cerrar
     * mientras se guarda.
     */
    if (
      loading
    ) {
      return;
    }

    onClose();
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
     * VALIDAR FORMULARIO
     * ==========================================================
     *
     * CREATE:
     *
     * validateDetalleAccion()
     *
     * EDIT:
     *
     * validateUpdateDetalleAccion()
     */
    const validation =
      isEdit

        ? validateUpdateDetalleAccion(
            form,
          )

        : validateDetalleAccion(
            form,
          );

    /**
     * ==========================================================
     * PASO 2
     * ERROR DE ZOD
     * ==========================================================
     */
    if (
      !validation.isValid
    ) {
      setErrors(
        validation.errors,
      );

      setMessage(
        'Revise los campos marcados antes de guardar.',
      );

      return;
    }

    /**
     * ==========================================================
     * PASO 3
     * VALIDAR ID SI EDITAMOS
     * ==========================================================
     */
    let detalleId =
      null;

    if (
      isEdit
    ) {
      const idValidation =
        validateDetalleAccionId(
          detalle?.id,
        );

      if (
        !idValidation.isValid
      ) {
        setMessage(
          idValidation.error,
        );

        return;
      }

      detalleId =
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
       * form puede tener:
       *
       * {
       *   tipo_accion_id: "1",
       *   nombre_accion: "Carnet socio",
       *   precio_accion: "100",
       *   tipo_cobro: "UNICO"
       * }
       *
       * validation.data:
       *
       * {
       *   tipo_accion_id: 1,
       *   nombre_accion: "Carnet socio",
       *   precio_accion: 100,
       *   tipo_cobro: "UNICO"
       * }
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

          ? await DetalleAccionServices.update(
              detalleId,
              payload,
            )

          : await DetalleAccionServices.create(
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
            'No se pudo guardar el detalle',
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
              ? 'Detalle actualizado correctamente'
              : 'Detalle registrado correctamente'
          ),
      );

      /**
       * Avisamos al Page.
       */
      onSuccess?.();

    } catch (error) {
      setMessage(
        error?.message ||
          'Error inesperado al guardar el detalle',
      );

    } finally {
      setLoading(
        false,
      );
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(
        event,
      ) => {
        /**
         * Cerrar solamente cuando
         * hacemos click sobre el fondo.
         */
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >

      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ====================================================
            HEADER
            ==================================================== */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-start gap-4">

            <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">

              <ReceiptPercentIcon className="h-6 w-6" />

            </div>

            <div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                <span>
                  Detalles de acción
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

              <h2 className="mt-1 text-xl font-bold text-slate-900">

                {isEdit
                  ? 'Editar detalle de acción'
                  : 'Registrar detalle de acción'}

              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure el tipo de acción, concepto, precio y tipo de cobro.
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
            FORMULARIO
            ==================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="space-y-6 p-6">

            {/* MENSAJE */}

            {message && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />

                <p className="font-medium">
                  {message}
                </p>

              </div>
            )}

            {/* ==================================================
                DATOS DEL DETALLE
                ================================================== */}

            <section>

              <div className="mb-4 flex items-start gap-3">

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  1
                </span>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Información del concepto
                  </h3>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Defina los datos del detalle de acción.
                  </p>

                </div>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* ================================================
                    TIPO DE ACCIÓN
                    ================================================ */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Tipo de acción

                    <span className="ml-1 text-red-500">
                      *
                    </span>

                  </label>

                  <div className="relative">

                    <ReceiptPercentIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <select
                      name="tipo_accion_id"
                      value={
                        form.tipo_accion_id
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        loadingTipos
                      }
                      className={`${inputClass(
                        Boolean(
                          errors.tipo_accion_id,
                        ),
                      )} appearance-none pl-11 pr-10 disabled:bg-slate-100`}
                    >

                      <option value="">
                        Seleccione tipo de acción
                      </option>

                      {tiposAccion.map(
                        (
                          tipo,
                        ) => (
                          <option
                            key={
                              tipo.value
                            }
                            value={
                              tipo.value
                            }
                          >
                            {
                              tipo.label
                            }
                          </option>
                        ),
                      )}

                    </select>

                    <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  </div>

                  {errors.tipo_accion_id && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">

                      <ExclamationCircleIcon className="h-4 w-4" />

                      {
                        errors.tipo_accion_id
                      }

                    </p>
                  )}

                </div>

                {/* ================================================
                    TIPO DE COBRO
                    ================================================ */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Tipo de cobro

                    <span className="ml-1 text-red-500">
                      *
                    </span>

                  </label>

                  <div className="relative">

                    <ReceiptPercentIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <select
                      name="tipo_cobro"
                      value={
                        form.tipo_cobro
                      }
                      onChange={
                        handleChange
                      }
                      className={`${inputClass(
                        Boolean(
                          errors.tipo_cobro,
                        ),
                      )} appearance-none pl-11 pr-10`}
                    >

                      <option value="">
                        Seleccione tipo de cobro
                      </option>

                      <option value="UNICO">
                        Único
                      </option>

                      <option value="MENSUAL">
                        Mensual
                      </option>

                    </select>

                    <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  </div>

                  {errors.tipo_cobro && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">

                      <ExclamationCircleIcon className="h-4 w-4" />

                      {
                        errors.tipo_cobro
                      }

                    </p>
                  )}

                </div>

                {/* ================================================
                    NOMBRE
                    ================================================ */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Nombre del detalle

                    <span className="ml-1 text-red-500">
                      *
                    </span>

                  </label>

                  <div className="relative">

                    <ClipboardDocumentListIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="nombre_accion"
                      value={
                        form.nombre_accion
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Ej. Carnet socio"
                      className={`${inputClass(
                        Boolean(
                          errors.nombre_accion,
                        ),
                      )} pl-11`}
                    />

                  </div>

                  {errors.nombre_accion && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">

                      {
                        errors.nombre_accion
                      }

                    </p>
                  )}

                </div>

                {/* ================================================
                    PRECIO
                    ================================================ */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Precio

                    <span className="ml-1 text-red-500">
                      *
                    </span>

                  </label>

                  <div className="relative">

                    <BanknotesIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="number"
                      name="precio_accion"
                      min="0"
                      step="0.01"
                      value={
                        form.precio_accion
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="100.00"
                      className={`${inputClass(
                        Boolean(
                          errors.precio_accion,
                        ),
                      )} pl-11`}
                    />

                  </div>

                  {errors.precio_accion && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">

                      {
                        errors.precio_accion
                      }

                    </p>
                  )}

                </div>

              </div>

            </section>

            {/* ==================================================
                INFORMACIÓN
                ================================================== */}

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

              <div className="flex items-start gap-3">

                <div className="rounded-full bg-white p-2 text-blue-700">

                  <ReceiptPercentIcon className="h-4 w-4" />

                </div>

                <div>

                  <h4 className="text-sm font-bold text-blue-900">
                    Información
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-blue-800/80">

                    El cobro único se genera una sola vez.

                    El cobro mensual se utiliza para conceptos periódicos.

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              BOTONES
              ================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                loading
              }
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >

              Cancelar

            </button>

            <button
              type="submit"
              disabled={
                loading ||
                loadingTipos
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
                    : 'Registrar detalle'}
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}