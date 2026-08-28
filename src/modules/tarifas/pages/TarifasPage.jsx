import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  BanknotesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon, // ← FALTABA ESTE
  PowerIcon,
  ScaleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  toast,
} from 'react-toastify';

import TarifaModal
  from '../components/TarifaModal';

import {
  TarifasServices as Servs,
} from '../services/tarifas.services';

/**
 * ============================================================
 * FUNCIONES DE VALIDACIÓN
 * ============================================================
 */
import {
  validateTarifaId,
  validateTarifaParams,
} from '../schema/tarifas.schema';

/**
 * ============================================================
 * FORMATO DE MONEDA
 * ============================================================
 */
const formatMoney = (
  value,
) =>
  new Intl.NumberFormat(
    'es-BO',
    {
      style:
        'currency',

      currency:
        'BOB',
    },
  ).format(
    Number(
      value || 0,
    ),
  );

export default function TarifasPage() {
  /**
   * ============================================================
   * DATOS
   * ============================================================
   */
  const [
    tarifas,
    setTarifas,
  ] = useState([]);

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

    limit: 5,

    totalItems: 0,

    totalPages: 1,
  });

  /**
   * ============================================================
   * FILTROS
   * ============================================================
   */
  const [
    search,
    setSearch,
  ] = useState('');

  /**
   * Select utiliza:
   *
   * ''
   * 'true'
   * 'false'
   */
  const [
    estado,
    setEstado,
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
    loadingAction,
    setLoadingAction,
  ] = useState(false);

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    selectedTarifa,
    setSelectedTarifa,
  ] = useState(null);

  /**
   * ============================================================
   * CONVERTIR ESTADO
   * ============================================================
   *
   * ''
   *
   * -> undefined
   *
   * 'true'
   *
   * -> true
   *
   * 'false'
   *
   * -> false
   */
  const getEstadoValue = () => {
    if (
      estado === ''
    ) {
      return undefined;
    }

    return (
      estado ===
      'true'
    );
  };

  /**
   * ============================================================
   * OBTENER TARIFAS
   * ============================================================
   */
  const fetchTarifas =
    async () => {
      try {
        setLoading(
          true,
        );

        /**
         * ======================================================
         * PASO 1
         * CONSTRUIR PARAMS
         * ======================================================
         */
        const params = {
          page:
            pagination.page,

          limit:
            pagination.limit,

          search,

          estado:
            getEstadoValue(),
        };

        /**
         * ======================================================
         * PASO 2
         * VALIDAR PARAMS
         * ======================================================
         */
        const validation =
          validateTarifaParams(
            params,
          );

        if (
          !validation.isValid
        ) {
          toast.error(
            'Los parámetros de búsqueda no son válidos',
          );

          setTarifas([]);

          return;
        }

        /**
         * ======================================================
         * PASO 3
         * SERVICE
         * ======================================================
         *
         * IMPORTANTE:
         *
         * getAll recibe UN objeto.
         */
        const response =
          await Servs.getAll(
            validation.data,
          );

        /**
         * ======================================================
         * PASO 4
         * ERROR BACKEND
         * ======================================================
         */
        if (
          !response?.ok
        ) {
          toast.error(
            response?.message ||
              'Error al cargar las tarifas',
          );

          setTarifas([]);

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
         * ======================================================
         * PASO 5
         * GUARDAR DATOS
         * ======================================================
         */
        setTarifas(
          Array.isArray(
            response.data,
          )
            ? response.data
            : [],
        );

        /**
         * ======================================================
         * PASO 6
         * ACTUALIZAR PAGINACIÓN
         * ======================================================
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
            'Error inesperado al cargar las tarifas',
        );

      } finally {
        setLoading(
          false,
        );
      }
    };

  /**
   * ============================================================
   * RECARGAR
   * ============================================================
   */
  useEffect(() => {
    fetchTarifas();
  }, [
    pagination.page,
    pagination.limit,
    search,
    estado,
  ]);

  /**
   * ============================================================
   * CREAR
   * ============================================================
   */
  const openCreateModal =
    () => {
      setSelectedTarifa(
        null,
      );

      setModalOpen(
        true,
      );
    };

  /**
   * ============================================================
   * EDITAR
   * ============================================================
   */
  const openEditModal =
    async (
      tarifa,
    ) => {
      try {
        /**
         * ======================================================
         * PASO 1
         * VALIDAR ID
         * ======================================================
         */
        const validation =
          validateTarifaId(
            tarifa?.id,
          );

        if (
          !validation.isValid
        ) {
          toast.error(
            validation.error,
          );

          return;
        }

        /**
         * ======================================================
         * PASO 2
         * GET POR ID
         * ======================================================
         */
        const response =
          await Servs.getById(
            validation.data,
          );

        if (
          !response?.ok
        ) {
          toast.error(
            response?.message ||
              'Error al cargar la tarifa',
          );

          return;
        }

        /**
         * Tu página actual contempla
         * ambos formatos:
         *
         * response.dato
         *
         * o:
         *
         * response.data
         */
        const tarifaCompleta =
          response.dato ??
          response.data;

        if (
          !tarifaCompleta
        ) {
          toast.error(
            'No se encontró la información de la tarifa',
          );

          return;
        }

        /**
         * ======================================================
         * PASO 3
         * SELECCIONAR
         * ======================================================
         */
        setSelectedTarifa(
          tarifaCompleta,
        );

        /**
         * ======================================================
         * PASO 4
         * ABRIR MODAL
         * ======================================================
         */
        setModalOpen(
          true,
        );

      } catch (error) {
        toast.error(
          error?.message ||
            'Error inesperado al cargar la tarifa',
        );
      }
    };

  /**
   * ============================================================
   * CERRAR MODAL
   * ============================================================
   */
  const closeModal = () => {
    setModalOpen(
      false,
    );

    setSelectedTarifa(
      null,
    );
  };

  /**
   * ============================================================
   * CREATE / UPDATE EXITOSO
   * ============================================================
   */
  const handleSuccess =
    async () => {
      /**
       * TarifaModal ya muestra el toast.
       *
       * Aquí solamente:
       *
       * cerramos
       * +
       * recargamos tabla.
       */
      closeModal();

      await fetchTarifas();
    };

  /**
   * ============================================================
   * CAMBIAR ESTADO
   * ============================================================
   */
  const handleChangeEstado =
    async (
      tarifa,
    ) => {
      /**
       * ========================================================
       * PASO 1
       * VALIDAR ID
       * ========================================================
       */
      const validation =
        validateTarifaId(
          tarifa?.id,
        );

      if (
        !validation.isValid
      ) {
        toast.error(
          validation.error,
        );

        return;
      }

      /**
       * Definimos la acción visual.
       */
      const accion =
        tarifa.estado
          ? 'deshabilitar'
          : 'habilitar';

      /**
       * Confirmación.
       *
       * Más adelante puedes reemplazar esto
       * por tu ConfirmModal reutilizable,
       * igual que en Socios.
       */
      const confirmacion =
        window.confirm(
          `¿Seguro que deseas ${accion} la tarifa "${tarifa.nombre_tarifa}"?`,
        );

      if (
        !confirmacion
      ) {
        return;
      }

      try {
        setLoadingAction(
          true,
        );

        /**
         * ======================================================
         * PASO 2
         * SERVICE
         * ======================================================
         */
        const response =
          await Servs.changeEstado(
            validation.data,
          );

        if (
          !response?.ok
        ) {
          toast.error(
            response?.message ||
              'Error al cambiar el estado',
          );

          return;
        }

        toast.success(
          response?.message ||
            'Estado actualizado correctamente',
        );

        /**
         * ======================================================
         * PASO 3
         * RECARGAR
         * ======================================================
         */
        await fetchTarifas();

      } catch (error) {
        toast.error(
          error?.message ||
            'Error inesperado al cambiar el estado',
        );

      } finally {
        setLoadingAction(
          false,
        );
      }
    };

  /**
   * ============================================================
   * LIMPIAR FILTROS
   * ============================================================
   */
  const clearFilters =
    () => {
      setPagination(
        (previous) => ({
          ...previous,

          page:
            1,
        }),
      );

      setSearch('');

      setEstado('');
    };

  /**
   * ============================================================
   * MÉTRICAS
   * ============================================================
   */
  const resumen =
    useMemo(() => {
      /**
       * Cantidad de rangos
       * visibles actualmente.
       */
      const totalRangos =
        tarifas.reduce(
          (
            total,
            tarifa,
          ) =>
            total +
            (
              Array.isArray(
                tarifa.rangosTarifa,
              )
                ? tarifa.rangosTarifa.length
                : 0
            ),
          0,
        );

      const activas =
        tarifas.filter(
          (tarifa) =>
            Boolean(
              tarifa.estado,
            ),
        ).length;

      const inactivas =
        tarifas.length -
        activas;

      return {
        visibles:
          tarifas.length,

        totalRangos,

        activas,

        inactivas,
      };
    }, [
      tarifas,
    ]);

  return (
    <section className="min-h-screen bg-slate-50">

      <div className="space-y-5">

        {/* ====================================================
            HEADER
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
                Tarifas
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de tarifas
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra las tarifas y define sus rangos de consumo.
            </p>

          </div>

          <button
            type="button"
            onClick={
              openCreateModal
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >

            <PlusIcon className="h-5 w-5" />

            Nueva tarifa

          </button>

        </header>

        {/* ====================================================
            MÉTRICAS
            ==================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            label="Total de tarifas"
            value={
              pagination.totalItems
            }
            icon={
              CurrencyDollarIcon
            }
          />

          <MetricCard
            label="Rangos visibles"
            value={
              resumen.totalRangos
            }
            icon={
              ChartBarIcon
            }
          />

          <MetricCard
            label="Activas visibles"
            value={
              resumen.activas
            }
            icon={
              CheckCircleIcon
            }
          />

          <MetricCard
            label="Inactivas visibles"
            value={
              resumen.inactivas
            }
            icon={
              PowerIcon
            }
          />

        </div>

        {/* ====================================================
            CONTENEDOR
            ==================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* ==================================================
              FILTROS
              ================================================== */}

          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">

            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">

              <div>

                <h2 className="font-bold text-slate-900">
                  Tarifas registradas
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Consulta, edita y administra el estado de las tarifas.
                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* BÚSQUEDA */}

                <div className="relative w-full sm:w-80">

                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={
                      search
                    }
                    onChange={(
                      event,
                    ) => {
                      setPagination(
                        (
                          previous,
                        ) => ({
                          ...previous,

                          page:
                            1,
                        }),
                      );

                      setSearch(
                        event.target.value,
                      );
                    }}
                    placeholder="Buscar tarifa"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-11 pr-11 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setPagination(
                          (
                            previous,
                          ) => ({
                            ...previous,

                            page:
                              1,
                          }),
                        );

                        setSearch('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
                    >

                      <XMarkIcon className="h-4 w-4" />

                    </button>
                  )}

                </div>

                {/* ESTADO */}

                <select
                  value={
                    estado
                  }
                  onChange={(
                    event,
                  ) => {
                    setPagination(
                      (
                        previous,
                      ) => ({
                        ...previous,

                        page:
                          1,
                      }),
                    );

                    setEstado(
                      event.target.value,
                    );
                  }}
                  className="min-w-40 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                >

                  <option value="">
                    Todas
                  </option>

                  <option value="true">
                    Activas
                  </option>

                  <option value="false">
                    Inactivas
                  </option>

                </select>

                {/* LIMPIAR */}

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >

                  <ArrowPathIcon className="h-4 w-4" />

                  Limpiar

                </button>

              </div>

            </div>

          </div>

          {/* ==================================================
              TABLA
              ================================================== */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-237.5 text-left text-sm">

              <thead className="border-b border-slate-200 bg-slate-50/80">

                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">

                  <th className="px-6 py-4">
                    Tarifa
                  </th>

                  <th className="px-4 py-4">
                    Código
                  </th>

                  <th className="px-4 py-4">
                    Rangos
                  </th>

                  <th className="px-4 py-4">
                    Estado
                  </th>

                  <th className="px-6 py-4 text-right">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {/* LOADING */}

                {loading ? (
                  <tr>

                    <td
                      colSpan={5}
                      className="px-6 py-16"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

                        <p className="mt-3 text-sm text-slate-500">
                          Cargando tarifas...
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : tarifas.length ===
                  0 ? (
                  /**
                   * SIN DATOS
                   */
                  <tr>

                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center text-slate-500"
                    >
                      No existen tarifas.
                    </td>

                  </tr>

                ) : (
                  /**
                   * REGISTROS
                   */
                  tarifas.map(
                    (
                      tarifa,
                    ) => {
                      const rangos =
                        Array.isArray(
                          tarifa.rangosTarifa,
                        )
                          ? tarifa.rangosTarifa
                          : [];

                      const activo =
                        Boolean(
                          tarifa.estado,
                        );

                      return (
                        <tr
                          key={
                            tarifa.id
                          }
                          className="transition hover:bg-slate-50"
                        >

                          {/* TARIFA */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">

                                <BanknotesIcon className="h-5 w-5" />

                              </div>

                              <div>

                                <p className="font-bold text-slate-900">
                                  {tarifa.nombre_tarifa}
                                </p>

                                <p className="text-xs text-slate-500">
                                  Tarifa de consumo
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* CÓDIGO */}

                          <td className="px-4 py-4 font-semibold text-slate-600">

                            #

                            {String(
                              tarifa.id,
                            ).padStart(
                              4,
                              '0',
                            )}

                          </td>

                          {/* RANGOS */}

                          <td className="px-4 py-4">

                            <div className="flex max-w-xl flex-wrap gap-2">

                              {rangos.map(
                                (
                                  rango,
                                  index,
                                ) => (
                                  <span
                                    key={
                                      rango.id ||
                                      index
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                                  >

                                    <ScaleIcon className="h-3.5 w-3.5" />

                                    {rango.consumo_minimo}

                                    {' - '}

                                    {rango.consumo_maximo ===
                                    null
                                      ? '∞'
                                      : rango.consumo_maximo}

                                    {' · '}

                                    {formatMoney(
                                      rango.precio,
                                    )}

                                  </span>
                                ),
                              )}

                            </div>

                          </td>

                          {/* ESTADO */}

                          <td className="px-4 py-4">

                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                                activo
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : 'border-slate-200 bg-slate-100 text-slate-600'
                              }`}
                            >

                              <span
                                className={`h-2 w-2 rounded-full ${
                                  activo
                                    ? 'bg-emerald-500'
                                    : 'bg-slate-400'
                                }`}
                              />

                              {activo
                                ? 'Activa'
                                : 'Inactiva'}

                            </span>

                          </td>

                          {/* ACCIONES */}

                          <td className="px-6 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    tarifa,
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                              >

                                <PencilSquareIcon className="h-4 w-4" />

                                Editar

                              </button>

                              <button
                                type="button"
                                disabled={
                                  loadingAction
                                }
                                onClick={() =>
                                  handleChangeEstado(
                                    tarifa,
                                  )
                                }
                                className={`rounded-lg border p-2 ${
                                  activo
                                    ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                } disabled:opacity-50`}
                              >

                                <PowerIcon className="h-4 w-4" />

                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    },
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* ==================================================
              PAGINACIÓN
              ================================================== */}

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

            <p className="text-sm text-slate-500">

              Mostrando{' '}

              <strong>
                {tarifas.length}
              </strong>

              {' '}de{' '}

              <strong>
                {pagination.totalItems}
              </strong>

            </p>

            <div className="flex items-center gap-2">

              {/* ANTERIOR */}

              <button
                type="button"
                disabled={
                  pagination.page <=
                    1 ||
                  loading
                }
                onClick={() =>
                  setPagination(
                    (
                      previous,
                    ) => ({
                      ...previous,

                      page:
                        previous.page -
                        1,
                    }),
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
              >

                <ChevronLeftIcon className="h-4 w-4" />

              </button>

              {/* PÁGINA */}

              <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                {pagination.page}
              </span>

              <span className="text-sm text-slate-400">
                de{' '}
                {pagination.totalPages}
              </span>

              {/* SIGUIENTE */}

              <button
                type="button"
                disabled={
                  pagination.page >=
                    pagination.totalPages ||
                  loading
                }
                onClick={() =>
                  setPagination(
                    (
                      previous,
                    ) => ({
                      ...previous,

                      page:
                        previous.page +
                        1,
                    }),
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
              >

                <ChevronRightIcon className="h-4 w-4" />

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          MODAL
          ====================================================== */}

      <TarifaModal
        open={
          modalOpen
        }
        tarifa={
          selectedTarifa
        }
        onClose={
          closeModal
        }
        onSuccess={
          handleSuccess
        }
      />

    </section>
  );
}

/**
 * ============================================================
 * TARJETA MÉTRICA
 * ============================================================
 */
function MetricCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

        </div>

        <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">

          <Icon className="h-6 w-6" />

        </div>

      </div>

    </article>
  );
}