import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  PlusIcon,
  ScaleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  toast,
} from 'react-toastify';

import {
  TarifasServices as Servs,
} from '../services/tarifas.services';

/**
 * ============================================================
 * IMPORTAMOS FUNCIÓN DEL SCHEMA
 * ============================================================
 *
 * NO importamos tarifaSchema.
 *
 * NO usamos safeParse aquí.
 */
import {
  validateTarifaForm,
} from '../schema/tarifas.schema';

/**
 * ============================================================
 * RANGO VACÍO
 * ============================================================
 */
const emptyRango = {
  consumo_minimo: '',
  consumo_maximo: '',
  precio: '',
};

/**
 * ============================================================
 * FORMULARIO INICIAL
 * ============================================================
 */
const initialForm = () => ({
  nombre_tarifa: '',

  rangosTarifa: [
    {
      ...emptyRango,
    },
  ],
});

/**
 * ============================================================
 * CLASE DEL INPUT
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

export default function TarifaModal({
  open,
  tarifa,
  onClose,
  onSuccess,
}) {
  /**
   * ============================================================
   * ¿ESTAMOS EDITANDO?
   * ============================================================
   */
  const isEdit =
    Boolean(
      tarifa,
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
    initialForm(),
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
   * LOADING
   * ============================================================
   */
  const [
    loading,
    setLoading,
  ] = useState(false);

  /**
   * ============================================================
   * MENSAJE LOCAL DEL MODAL
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
   *
   * Se ejecuta cada vez que:
   *
   * - abrimos
   * - cambia la tarifa
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
     * CREAR
     * ==========================================================
     */
    if (
      !tarifa
    ) {
      setForm(
        initialForm(),
      );

      return;
    }

    /**
     * ==========================================================
     * EDITAR
     * ==========================================================
     */
    const rangos =
      Array.isArray(
        tarifa.rangosTarifa,
      )
        ? tarifa.rangosTarifa
        : [];

    setForm({
      nombre_tarifa:
        tarifa.nombre_tarifa ||
        '',

      rangosTarifa:
        rangos.length > 0
          ? rangos.map(
              (
                rango,
              ) => ({
                /**
                 * Los inputs trabajan bien
                 * tanto con números como strings.
                 */
                consumo_minimo:
                  rango.consumo_minimo ??
                  '',

                /**
                 * Backend:
                 *
                 * null
                 *
                 * UI:
                 *
                 * ''
                 */
                consumo_maximo:
                  rango.consumo_maximo ??
                  '',

                precio:
                  rango.precio ??
                  '',
              }),
            )
          : [
              {
                ...emptyRango,
              },
            ],
    });
  }, [
    open,
    tarifa,
  ]);

  /**
   * ============================================================
   * CAMBIAR NOMBRE
   * ============================================================
   */
  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,

        [name]:
          value,
      }),
    );

    /**
     * Eliminamos solamente
     * el error del campo modificado.
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
   * CAMBIAR UN CAMPO DE UN RANGO
   * ============================================================
   */
  const handleRangoChange = (
    index,
    field,
    value,
  ) => {
    /**
     * Ejemplo:
     *
     * index = 1
     *
     * field = "precio"
     *
     * value = "5.50"
     */
    setForm(
      (previous) => ({
        ...previous,

        rangosTarifa:
          previous.rangosTarifa.map(
            (
              rango,
              currentIndex,
            ) =>
              currentIndex ===
              index
                ? {
                    ...rango,

                    [field]:
                      value,
                  }
                : rango,
          ),
      }),
    );

    /**
     * Limpiamos error específico:
     *
     * precio_1
     */
    setErrors(
      (previous) => ({
        ...previous,

        [`${field}_${index}`]:
          undefined,

        rangosTarifa:
          undefined,
      }),
    );

    setMessage('');
  };

  /**
   * ============================================================
   * AGREGAR RANGO
   * ============================================================
   */
  const addRango = () => {
    const rangos =
      form.rangosTarifa;

    const ultimo =
      rangos[
        rangos.length -
          1
      ];

    /**
     * Para agregar un nuevo rango,
     * el actual debe tener máximo.
     */
    if (
      ultimo.consumo_maximo ===
        '' ||
      ultimo.consumo_maximo ===
        null ||
      ultimo.consumo_maximo ===
        undefined
    ) {
      setMessage(
        'Debe indicar el consumo máximo del último rango antes de agregar otro.',
      );

      return;
    }

    const maximo =
      Number(
        ultimo.consumo_maximo,
      );

    if (
      Number.isNaN(
        maximo,
      )
    ) {
      setMessage(
        'El consumo máximo del último rango no es válido.',
      );

      return;
    }

    /**
     * ==========================================================
     * NUEVO MÍNIMO
     * ==========================================================
     *
     * 0 - 10
     *
     * siguiente:
     *
     * 11
     */
    const nuevoMinimo =
      maximo + 1;

    setForm(
      (previous) => ({
        ...previous,

        rangosTarifa: [
          ...previous.rangosTarifa,

          {
            consumo_minimo:
              nuevoMinimo,

            consumo_maximo:
              '',

            precio:
              '',
          },
        ],
      }),
    );

    setMessage('');
  };

  /**
   * ============================================================
   * ELIMINAR RANGO
   * ============================================================
   */
  const removeRango = (
    index,
  ) => {
    /**
     * Siempre debe existir
     * al menos un rango.
     */
    if (
      form.rangosTarifa
        .length <= 1
    ) {
      return;
    }

    setForm(
      (previous) => ({
        ...previous,

        rangosTarifa:
          previous.rangosTarifa.filter(
            (
              _,
              currentIndex,
            ) =>
              currentIndex !==
              index,
          ),
      }),
    );

    /**
     * Como los índices cambian,
     * limpiamos todos los errores.
     */
    setErrors({});

    setMessage('');
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
     * VALIDAR
     * ==========================================================
     *
     * El modal NO sabe cómo funciona Zod.
     */
    const validation =
      validateTarifaForm(
        form,
      );

    /**
     * ==========================================================
     * PASO 2
     * SI HAY ERRORES
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

    try {
      setLoading(
        true,
      );

      setMessage('');

      /**
       * ========================================================
       * PASO 3
       * PAYLOAD VALIDADO
       * ========================================================
       *
       * NO enviamos form directamente.
       *
       * validation.data tiene números reales:
       *
       * {
       *   nombre_tarifa: 'Domiciliar',
       *   rangosTarifa: [
       *      {
       *        consumo_minimo: 0,
       *        consumo_maximo: 10,
       *        precio: 5
       *      }
       *   ]
       * }
       */
      const payload =
        validation.data;

      /**
       * ========================================================
       * PASO 4
       * CREATE / UPDATE
       * ========================================================
       */
      const response =
        isEdit
          ? await Servs.update(
              tarifa.id,
              payload,
            )
          : await Servs.create(
              payload,
            );

      /**
       * ========================================================
       * PASO 5
       * ERROR BACKEND
       * ========================================================
       */
      if (
        !response?.ok
      ) {
        setMessage(
          response?.message ||
            'No se pudo guardar la tarifa',
        );

        return;
      }

      /**
       * ========================================================
       * PASO 6
       * ÉXITO
       * ========================================================
       */
      toast.success(
        response?.message ||
          (
            isEdit
              ? 'Tarifa actualizada correctamente'
              : 'Tarifa creada correctamente'
          ),
      );

      /**
       * Avisamos a la página.
       */
      onSuccess?.();

    } catch (error) {
      setMessage(
        error?.message ||
          'Error inesperado al guardar la tarifa',
      );

    } finally {
      setLoading(
        false,
      );
    }
  };

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
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >

      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ====================================================
            HEADER
            ==================================================== */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-start gap-4">

            <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">

              <BanknotesIcon className="h-6 w-6" />

            </div>

            <div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                <span>
                  Tarifas
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
                  ? 'Editar tarifa'
                  : 'Registrar tarifa'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure el nombre y los rangos de consumo.
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
          className="max-h-[calc(92vh-90px)] overflow-y-auto"
        >

          <div className="space-y-7 p-6">

            {/* MENSAJE */}

            {message && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />

                <span>
                  {message}
                </span>

              </div>
            )}

            {/* ==================================================
                INFORMACIÓN PRINCIPAL
                ================================================== */}

            <section>

              <div className="mb-4 flex items-start gap-3">

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  1
                </span>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Información principal
                  </h3>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Ingrese el nombre identificador de la tarifa.
                  </p>

                </div>

              </div>

              <div className="max-w-xl">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nombre de tarifa
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">

                  <CurrencyDollarIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="nombre_tarifa"
                    value={
                      form.nombre_tarifa
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. Domiciliar"
                    className={`${inputClass(
                      Boolean(
                        errors.nombre_tarifa,
                      ),
                    )} pl-11`}
                  />

                </div>

                {errors.nombre_tarifa && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.nombre_tarifa}
                  </p>
                )}

              </div>

            </section>

            <div className="border-t border-slate-100" />

            {/* ==================================================
                RANGOS
                ================================================== */}

            <section>

              <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div className="flex items-start gap-3">

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    2
                  </span>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Rangos de consumo
                    </h3>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Configure mínimo, máximo y precio.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    addRango
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >

                  <PlusIcon className="h-5 w-5" />

                  Agregar rango

                </button>

              </div>

              {errors.rangosTarifa && (
                <p className="mb-3 text-sm font-medium text-red-600">
                  {errors.rangosTarifa}
                </p>
              )}

              <div className="space-y-4">

                {form.rangosTarifa.map(
                  (
                    rango,
                    index,
                  ) => {
                    const esUltimo =
                      index ===
                      form.rangosTarifa.length -
                        1;

                    return (
                      <div
                        key={
                          index
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                      >

                        {/* HEADER DEL RANGO */}

                        <div className="mb-4 flex items-center justify-between">

                          <div className="flex items-center gap-2">

                            <span className="rounded-full bg-white p-2 text-emerald-700 shadow-sm">

                              <ScaleIcon className="h-4 w-4" />

                            </span>

                            <div>

                              <p className="text-sm font-bold text-slate-800">
                                Rango{' '}
                                {index +
                                  1}
                              </p>

                              {esUltimo && (
                                <p className="text-xs text-slate-500">
                                  El máximo puede quedar vacío para representar sin límite.
                                </p>
                              )}

                            </div>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeRango(
                                index,
                              )
                            }
                            disabled={
                              form.rangosTarifa.length ===
                              1
                            }
                            className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                            title="Eliminar rango"
                          >

                            <TrashIcon className="h-4 w-4" />

                          </button>

                        </div>

                        {/* INPUTS */}

                        <div className="grid gap-4 md:grid-cols-3">

                          <RangeInput
                            label="Consumo mínimo"
                            value={
                              rango.consumo_minimo
                            }
                            error={
                              errors[
                                `consumo_minimo_${index}`
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              handleRangoChange(
                                index,
                                'consumo_minimo',
                                value,
                              )
                            }
                          />

                          <RangeInput
                            label={
                              esUltimo
                                ? 'Consumo máximo (opcional)'
                                : 'Consumo máximo'
                            }
                            value={
                              rango.consumo_maximo
                            }
                            error={
                              errors[
                                `consumo_maximo_${index}`
                              ]
                            }
                            placeholder={
                              esUltimo
                                ? 'Sin límite'
                                : ''
                            }
                            onChange={(
                              value,
                            ) =>
                              handleRangoChange(
                                index,
                                'consumo_maximo',
                                value,
                              )
                            }
                          />

                          <RangeInput
                            label="Precio"
                            value={
                              rango.precio
                            }
                            error={
                              errors[
                                `precio_${index}`
                              ]
                            }
                            step="0.01"
                            onChange={(
                              value,
                            ) =>
                              handleRangoChange(
                                index,
                                'precio',
                                value,
                              )
                            }
                          />

                        </div>

                      </div>
                    );
                  },
                )}

              </div>

            </section>

          </div>

          {/* ==================================================
              FOOTER
              ================================================== */}

          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">

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
                    : 'Registrar tarifa'}
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

/**
 * ============================================================
 * INPUT REUTILIZABLE DE UN RANGO
 * ============================================================
 */
function RangeInput({
  label,
  value,
  error,
  onChange,
  step = '1',
  placeholder = '',
}) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <input
        type="number"
        min="0"
        step={
          step
        }
        value={
          value
        }
        placeholder={
          placeholder
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className={
          inputClass(
            Boolean(
              error,
            ),
          )
        }
      />

      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}