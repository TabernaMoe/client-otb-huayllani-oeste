import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  toast,
} from 'react-toastify';

import {
  GestionesServices as Servs,
} from '../services/gestiones.services';

/**
 * ============================================================
 * IMPORTAMOS FUNCIONES DEL SCHEMA
 * ============================================================
 *
 * El JSX ya NO utiliza:
 *
 * safeParse()
 * z.object()
 * z.coerce()
 *
 * directamente.
 */
import {
  validateCreateGestion,
  validateGestionParams,
} from '../schema/gestiones.schema';

/**
 * ============================================================
 * FORMULARIO INICIAL
 * ============================================================
 *
 * El input entrega el año como string:
 *
 * {
 *   anio: "2027"
 * }
 *
 * El schema lo convertirá posteriormente a:
 *
 * {
 *   anio: 2027
 * }
 */
const INITIAL_FORM = {
  anio: '',
};

/**
 * ============================================================
 * CANTIDADES POR PÁGINA
 * ============================================================
 */
const PAGE_SIZE_OPTIONS = [
  5,
  10,
  20,
  50,
];

/**
 * ============================================================
 * CLASE DE INPUT
 * ============================================================
 */
const getInputClass = (
  hasError = false,
) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
  }`;

/**
 * ============================================================
 * FORMATEAR FECHA
 * ============================================================
 */
const formatDate = (
  date,
) => {
  if (!date) {
    return '-';
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return '-';
  }

  return parsedDate.toLocaleDateString(
    'es-BO',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  );
};

export default function GestionesPage() {
  /**
   * ============================================================
   * DATOS
   * ============================================================
   */

  const [
    gestiones,
    setGestiones,
  ] = useState([]);

  /**
   * ============================================================
   * FORMULARIO
   * ============================================================
   */

  const [
    form,
    setForm,
  ] = useState(
    INITIAL_FORM,
  );

  /**
   * Errores por campo.
   *
   * Ejemplo:
   *
   * {
   *   anio: 'El año debe...'
   * }
   */
  const [
    errors,
    setErrors,
  ] = useState({});

  /**
   * ============================================================
   * PAGINACIÓN
   * ============================================================
   */

  const [
    pagination,
    setPagination,
  ] = useState({
    page: 1,

    limit: 10,

    totalItems: 0,

    totalPages: 1,
  });

  /**
   * ============================================================
   * BÚSQUEDA
   * ============================================================
   */

  const [
    search,
    setSearch,
  ] = useState('');

  /**
   * ============================================================
   * INTERFAZ
   * ============================================================
   */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  /**
   * ============================================================
   * OBTENER GESTIONES
   * ============================================================
   */
  const fetchGestiones =
    useCallback(
      async () => {
        /**
         * ======================================================
         * PASO 1
         * PREPARAMOS PARÁMETROS
         * ======================================================
         */
        const params = {
          page:
            pagination.page,

          limit:
            pagination.limit,

          search,
        };

        /**
         * ======================================================
         * PASO 2
         * VALIDAMOS LOS PARÁMETROS
         * ======================================================
         *
         * El JSX solamente llama una función.
         */
        const validation =
          validateGestionParams(
            params,
          );

        if (
          !validation.isValid
        ) {
          toast.error(
            'Los parámetros de búsqueda no son válidos',
          );

          setGestiones([]);

          setPagination(
            (previous) => ({
              ...previous,

              totalItems:
                0,

              totalPages:
                1,
            }),
          );

          return;
        }

        try {
          setLoading(
            true,
          );

          /**
           * ====================================================
           * PASO 3
           * LLAMAMOS AL SERVICE
           * ====================================================
           *
           * validation.data contiene:
           *
           * {
           *   page: 1,
           *   limit: 10,
           *   search: ''
           * }
           */
          const response =
            await Servs.getAll(
              validation.data,
            );

          /**
           * ====================================================
           * PASO 4
           * ERROR DEL BACKEND
           * ====================================================
           */
          if (
            !response?.ok
          ) {
            toast.error(
              response?.message ||
                'Error al cargar las gestiones',
            );

            setGestiones([]);

            setPagination(
              (previous) => ({
                ...previous,

                totalItems:
                  0,

                totalPages:
                  1,
              }),
            );

            return;
          }

          /**
           * ====================================================
           * PASO 5
           * REGISTROS
           * ====================================================
           */
          setGestiones(
            Array.isArray(
              response.data,
            )
              ? response.data
              : [],
          );

          /**
           * ====================================================
           * PASO 6
           * PAGINACIÓN
           * ====================================================
           *
           * Tu backend devuelve:
           *
           * {
           *   total,
           *   page,
           *   limit,
           *   totalPages,
           *   data
           * }
           */
          setPagination(
            (previous) => ({
              ...previous,

              page:
                Number(
                  response.page ??
                    previous.page,
                ),

              limit:
                Number(
                  response.limit ??
                    previous.limit,
                ),

              totalItems:
                Number(
                  response.total ??
                    0,
                ),

              totalPages:
                Number(
                  response.totalPages ??
                    1,
                ),
            }),
          );

        } catch (error) {
          toast.error(
            error?.message ||
              'Error inesperado al cargar las gestiones',
          );

        } finally {
          setLoading(
            false,
          );
        }
      },
      [
        pagination.page,
        pagination.limit,
        search,
      ],
    );

  /**
   * ============================================================
   * RECARGAR CUANDO CAMBIA:
   *
   * - página
   * - límite
   * - búsqueda
   * ============================================================
   */
  useEffect(() => {
    fetchGestiones();
  }, [
    fetchGestiones,
  ]);

  /**
   * ============================================================
   * ABRIR MODAL
   * ============================================================
   */
  const openModal = () => {
    /**
     * Limpiamos formulario.
     */
    setForm(
      INITIAL_FORM,
    );

    /**
     * Limpiamos errores.
     */
    setErrors({});

    /**
     * Abrimos modal.
     */
    setModalOpen(
      true,
    );
  };

  /**
   * ============================================================
   * CERRAR MODAL
   * ============================================================
   */
  const closeModal = () => {
    /**
     * No permitimos cerrar
     * mientras se está guardando.
     */
    if (
      saving
    ) {
      return;
    }

    setModalOpen(
      false,
    );

    setForm(
      INITIAL_FORM,
    );

    setErrors({});
  };

  /**
   * ============================================================
   * CAMBIO DEL INPUT
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
     * ACTUALIZAMOS EL CAMPO
     * ==========================================================
     *
     * Ejemplo:
     *
     * name = "anio"
     *
     * value = "2027"
     */
    setForm(
      (previous) => ({
        ...previous,

        [name]:
          value,
      }),
    );

    /**
     * Quitamos solamente
     * el error del campo modificado.
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
   * CREAR GESTIÓN
   * ============================================================
   */
  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    /**
     * ==========================================================
     * PASO 1
     * VALIDAMOS
     * ==========================================================
     *
     * Ya no hacemos:
     *
     * createGestionSchema.safeParse(form)
     *
     * sino:
     */
    const validation =
      validateCreateGestion(
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

      toast.error(
        'Revise los campos marcados antes de guardar',
      );

      return;
    }

    try {
      setSaving(
        true,
      );

      /**
       * ========================================================
       * PASO 3
       * PAYLOAD VALIDADO
       * ========================================================
       *
       * form:
       *
       * {
       *   anio: "2027"
       * }
       *
       * validation.data:
       *
       * {
       *   anio: 2027
       * }
       */
      const payload =
        validation.data;

      /**
       * ========================================================
       * PASO 4
       * SERVICE
       * ========================================================
       */
      const response =
        await Servs.create(
          payload,
        );

      /**
       * ========================================================
       * PASO 5
       * ERROR DEL BACKEND
       * ========================================================
       */
      if (
        !response?.ok
      ) {
        toast.error(
          response?.message ||
            'Error al crear la gestión',
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
          'Gestión creada correctamente',
      );

      /**
       * Cerramos modal.
       */
      setModalOpen(
        false,
      );

      /**
       * Limpiamos formulario.
       */
      setForm(
        INITIAL_FORM,
      );

      setErrors({});

      /**
       * ========================================================
       * PASO 7
       * ACTUALIZAMOS TABLA
       * ========================================================
       *
       * Si estamos en otra página,
       * regresamos a página 1.
       */
      if (
        pagination.page !==
        1
      ) {
        setPagination(
          (previous) => ({
            ...previous,

            page:
              1,
          }),
        );

        return;
      }

      /**
       * Si ya estamos en página 1,
       * consultamos manualmente.
       */
      await fetchGestiones();

    } catch (error) {
      toast.error(
        error?.message ||
          'Error inesperado al crear la gestión',
      );

    } finally {
      setSaving(
        false,
      );
    }
  };

  /**
   * ============================================================
   * CAMBIAR BÚSQUEDA
   * ============================================================
   */
  const handleSearchChange = (
    event,
  ) => {
    /**
     * Cuando cambia el filtro,
     * regresamos a página 1.
     */
    setPagination(
      (previous) => ({
        ...previous,

        page:
          1,
      }),
    );

    setSearch(
      event.target.value,
    );
  };

  /**
   * ============================================================
   * LIMPIAR BÚSQUEDA
   * ============================================================
   */
  const clearSearch = () => {
    setSearch('');

    setPagination(
      (previous) => ({
        ...previous,

        page:
          1,
      }),
    );
  };

  /**
   * ============================================================
   * CAMBIAR LÍMITE
   * ============================================================
   */
  const handleLimitChange = (
    event,
  ) => {
    const newLimit =
      Number(
        event.target.value,
      );

    /**
     * Cambiamos límite
     * y regresamos a página 1.
     */
    setPagination(
      (previous) => ({
        ...previous,

        page:
          1,

        limit:
          newLimit,
      }),
    );
  };

  /**
   * ============================================================
   * PÁGINA ANTERIOR
   * ============================================================
   */
  const goToPreviousPage =
    () => {
      setPagination(
        (previous) => ({
          ...previous,

          page:
            Math.max(
              previous.page -
                1,
              1,
            ),
        }),
      );
    };

  /**
   * ============================================================
   * PÁGINA SIGUIENTE
   * ============================================================
   */
  const goToNextPage =
    () => {
      setPagination(
        (previous) => ({
          ...previous,

          page:
            Math.min(
              previous.page +
                1,
              previous.totalPages,
            ),
        }),
      );
    };

  /**
   * ============================================================
   * RESUMEN
   * ============================================================
   */
  const resumen =
    useMemo(() => {
      /**
       * Gestiones activas
       * en la página visible.
       */
      const activas =
        gestiones.filter(
          (gestion) =>
            gestion.estado ===
            'ACTIVO',
        ).length;

      /**
       * Gestiones no activas.
       */
      const inactivas =
        gestiones.filter(
          (gestion) =>
            gestion.estado !==
            'ACTIVO',
        ).length;

      /**
       * Extraemos los años.
       */
      const anios =
        gestiones
          .map(
            (gestion) =>
              Number(
                gestion.anio,
              ),
          )
          .filter(
            (anio) =>
              Number.isFinite(
                anio,
              ),
          );

      /**
       * Último año visible.
       */
      const ultima =
        anios.length >
        0
          ? Math.max(
              ...anios,
            )
          : '-';

      return {
        activas,

        inactivas,

        ultima,
      };
    }, [
      gestiones,
    ]);

  return (
    <section className="min-h-screen bg-slate-50">

      <div className="space-y-5">

        {/* ====================================================
            ENCABEZADO
            ==================================================== */}

        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>

            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">

              <span>
                Inicio
              </span>

              <span>
                /
              </span>

              <span>
                Configuración
              </span>

              <span>
                /
              </span>

              <span className="text-emerald-700">
                Gestiones
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de periodos anuales
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra las gestiones anuales utilizadas por el sistema.
            </p>

          </div>

          <button
            type="button"
            onClick={
              openModal
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" />

            Nueva gestión
          </button>

        </header>

        {/* ====================================================
            MÉTRICAS
            ==================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            label="Total registros"
            value={
              pagination.totalItems
            }
            icon={
              CalendarDaysIcon
            }
            iconClass="bg-slate-100 text-slate-700"
          />

          <MetricCard
            label="Activas visibles"
            value={
              resumen.activas
            }
            icon={
              CheckCircleIcon
            }
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            label="Inactivas visibles"
            value={
              resumen.inactivas
            }
            icon={
              CalendarDaysIcon
            }
            iconClass="bg-amber-50 text-amber-700"
          />

          <MetricCard
            label="Última visible"
            value={
              resumen.ultima
            }
            icon={
              CalendarDaysIcon
            }
            iconClass="bg-blue-50 text-blue-700"
          />

        </div>

        {/* ====================================================
            BÚSQUEDA
            ==================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="w-full lg:max-w-md">

            <label
              htmlFor="gestion-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Buscar gestión
            </label>

            <div className="relative">

              <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="gestion-search"
                type="text"
                value={
                  search
                }
                onChange={
                  handleSearchChange
                }
                placeholder="Ej. 2026"
                className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
              />

              {search && (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}

            </div>

          </div>

        </div>

        {/* ====================================================
            TABLA
            ==================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* CABECERA TABLA */}

          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h2 className="font-bold text-slate-900">
                  Gestiones registradas
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Consulta los periodos disponibles.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  fetchGestiones
                }
                disabled={
                  loading
                }
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <ArrowPathIcon
                  className={`h-4 w-4 ${
                    loading
                      ? 'animate-spin'
                      : ''
                  }`}
                />

                Actualizar
              </button>

            </div>

          </div>

          {/* TABLA */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-180 text-left text-sm">

              <thead className="border-b border-slate-200 bg-slate-50/80">

                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">

                  <th className="px-6 py-4">
                    Gestión
                  </th>

                  <th className="px-4 py-4">
                    Inicio
                  </th>

                  <th className="px-4 py-4">
                    Fin
                  </th>

                  <th className="px-4 py-4">
                    Estado
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {/* LOADING */}

                {loading ? (
                  <tr>

                    <td
                      colSpan={4}
                      className="px-6 py-16"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

                        <p className="mt-3 text-sm text-slate-500">
                          Cargando gestiones...
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : gestiones.length ===
                  0 ? (
                  /**
                   * SIN REGISTROS
                   */
                  <tr>

                    <td
                      colSpan={4}
                      className="px-6 py-16 text-center text-sm text-slate-500"
                    >
                      No hay gestiones registradas.
                    </td>

                  </tr>

                ) : (
                  /**
                   * REGISTROS
                   */
                  gestiones.map(
                    (
                      gestion,
                    ) => (
                      <tr
                        key={
                          gestion.id
                        }
                        className="transition hover:bg-slate-50"
                      >

                        {/* AÑO */}

                        <td className="px-6 py-4 font-bold text-slate-900">
                          Gestión{' '}
                          {
                            gestion.anio
                          }
                        </td>

                        {/* FECHA INICIO */}

                        <td className="px-4 py-4 text-slate-600">
                          {formatDate(
                            gestion.fecha_inicio,
                          )}
                        </td>

                        {/* FECHA FIN */}

                        <td className="px-4 py-4 text-slate-600">
                          {formatDate(
                            gestion.fecha_fin,
                          )}
                        </td>

                        {/* ESTADO */}

                        <td className="px-4 py-4">

                          <StatusBadge
                            status={
                              gestion.estado
                            }
                          />

                        </td>

                      </tr>
                    ),
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* ==================================================
              PAGINACIÓN
              ================================================== */}

          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            {/* IZQUIERDA */}

            <div className="flex items-center gap-3">

              <span className="text-sm text-slate-500">
                Página{' '}
                {
                  pagination.page
                }{' '}
                de{' '}
                {
                  pagination.totalPages
                }
              </span>

              <select
                value={
                  pagination.limit
                }
                onChange={
                  handleLimitChange
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-emerald-600"
              >

                {PAGE_SIZE_OPTIONS.map(
                  (
                    option,
                  ) => (
                    <option
                      key={
                        option
                      }
                      value={
                        option
                      }
                    >
                      {option}
                    </option>
                  ),
                )}

              </select>

            </div>

            {/* DERECHA */}

            <div className="flex gap-2">

              <button
                type="button"
                disabled={
                  pagination.page <=
                    1 ||
                  loading
                }
                onClick={
                  goToPreviousPage
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={
                  pagination.page >=
                    pagination.totalPages ||
                  loading
                }
                onClick={
                  goToNextPage
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Siguiente
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          MODAL CREAR GESTIÓN
          ====================================================== */}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
          role="presentation"
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gestion-modal-title"
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
          >

            {/* ENCABEZADO MODAL */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2
                  id="gestion-modal-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Registrar gestión
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Ingrese el año de la nueva gestión.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  saving
                }
                aria-label="Cerrar modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

            </div>

            {/* FORMULARIO */}

            <form
              onSubmit={
                handleSubmit
              }
              noValidate
            >

              <div className="p-6">

                <label
                  htmlFor="anio"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Año
                </label>

                <div className="relative">

                  <CalendarDaysIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="anio"
                    type="number"
                    name="anio"
                    value={
                      form.anio
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. 2027"
                    aria-invalid={
                      Boolean(
                        errors.anio,
                      )
                    }
                    className={`${getInputClass(
                      Boolean(
                        errors.anio,
                      ),
                    )} pl-11`}
                  />

                </div>

                {/* ERROR */}

                {errors.anio && (
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-red-600">

                    <ExclamationCircleIcon className="h-4 w-4 shrink-0" />

                    {
                      errors.anio
                    }

                  </p>
                )}

              </div>

              {/* BOTONES */}

              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />

                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />

                      Registrar gestión
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}

/**
 * ============================================================
 * TARJETA DE MÉTRICA
 * ============================================================
 */
function MetricCard({
  label,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between gap-4">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

        </div>

        <div
          className={`rounded-full p-3 ${iconClass}`}
        >
          <Icon className="h-6 w-6" />
        </div>

      </div>

    </article>
  );
}

/**
 * ============================================================
 * BADGE DE ESTADO
 * ============================================================
 */
function StatusBadge({
  status,
}) {
  const isActive =
    status ===
    'ACTIVO';

  const classes =
    isActive
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-slate-200 bg-slate-100 text-slate-600';

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${classes}`}
    >
      {status || '-'}
    </span>
  );
}