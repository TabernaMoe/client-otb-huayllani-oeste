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
  PlusIcon,
  PowerIcon,
  ScaleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { toast } from 'react-toastify';

import TarifaModal from '../components/TarifaModal';

import { TarifasServices } from '../services/tarifas.services';

/**
 * ============================================================
 * FORMATO DE MONEDA
 * ============================================================
 */
const formatMoney = (value) =>
  new Intl.NumberFormat(
    'es-BO',
    {
      style: 'currency',
      currency: 'BOB',
    },
  ).format(
    Number(value || 0),
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
  const [page, setPage] =
    useState(1);

  const [limit] =
    useState(5);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalItems,
    setTotalItems,
  ] = useState(0);

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
   * ''
   * true
   * false
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

  const [
    message,
    setMessage,
  ] = useState('');

  const [
    messageType,
    setMessageType,
  ] = useState('success');

  /**
   * ============================================================
   * ESTADO PARA EL SERVICE
   * ============================================================
   */
  const getEstadoValue = () => {
    if (estado === '') {
      return undefined;
    }

    return estado === 'true';
  };

  /**
   * ============================================================
   * OBTENER TARIFAS
   * ============================================================
   */
  const fetchTarifas = async () => {
    try {
      setLoading(true);

      setMessage('');

      const response =
        await TarifasServices.getAll(
          page,
          limit,
          search,
          getEstadoValue(),
        );

      if (!response?.ok) {
        setMessage(
          response?.message ||
            'Error al cargar las tarifas',
        );

        setMessageType(
          'error',
        );

        setTarifas([]);

        setTotalItems(0);

        setTotalPages(1);

        return;
      }

      setTarifas(
        Array.isArray(
          response.data,
        )
          ? response.data
          : [],
      );

      setTotalItems(
        Number(
          response.total || 0,
        ),
      );

      setTotalPages(
        Number(
          response.totalPages || 1,
        ),
      );
    } catch (error) {
      setMessage(
        error?.message ||
          'Error inesperado al cargar las tarifas',
      );

      setMessageType(
        'error',
      );
    } finally {
      setLoading(false);
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
    page,
    search,
    estado,
  ]);

  /**
   * ============================================================
   * CREAR
   * ============================================================
   */
  const openCreateModal = () => {
    setSelectedTarifa(null);

    setModalOpen(true);
  };

  /**
   * ============================================================
   * EDITAR
   * ============================================================
   */
  const openEditModal = async (
    tarifa,
  ) => {
    try {
      setMessage('');

      const response =
        await TarifasServices.getById(
          tarifa.id,
        );

      if (!response?.ok) {
        setMessage(
          response?.message ||
            'Error al cargar la tarifa',
        );

        setMessageType(
          'error',
        );

        return;
      }

      /**
       * En la documentación del GET por ID
       * la tarifa viene dentro de "dato".
       */
      const tarifaCompleta =
        response.dato ??
        response.data;

      if (!tarifaCompleta) {
        setMessage(
          'No se encontró la información de la tarifa.',
        );

        setMessageType(
          'error',
        );

        return;
      }

      setSelectedTarifa(
        tarifaCompleta,
      );

      setModalOpen(true);
    } catch (error) {
      setMessage(
        error?.message ||
          'Error inesperado al cargar la tarifa',
      );

      setMessageType(
        'error',
      );
    }
  };

  /**
   * ============================================================
   * CERRAR MODAL
   * ============================================================
   */
  const closeModal = () => {
    setModalOpen(false);

    setSelectedTarifa(null);
  };

  /**
   * ============================================================
   * GUARDADO CORRECTAMENTE
   * ============================================================
   */
  const handleSuccess = () => {
    setMessage(
      selectedTarifa
        ? 'Tarifa actualizada correctamente'
        : 'Tarifa creada correctamente',
    );

    setMessageType(
      'success',
    );

    closeModal();

    fetchTarifas();
  };

  /**
   * ============================================================
   * CAMBIAR ESTADO
   * ============================================================
   */
  const handleChangeEstado = async (
    tarifa,
  ) => {
    const accion =
      tarifa.estado
        ? 'deshabilitar'
        : 'habilitar';

    const confirmacion =
      window.confirm(
        `¿Seguro que deseas ${accion} la tarifa "${tarifa.nombre_tarifa}"?`,
      );

    if (!confirmacion) {
      return;
    }

    try {
      setLoadingAction(true);

      const response =
        await TarifasServices.changeEstado(
          tarifa.id,
        );

      if (!response?.ok) {
        setMessage(
          response?.message ||
            'Error al cambiar el estado',
        );

        setMessageType(
          'error',
        );

        return;
      }

      toast.success(
        response?.message ||
          'Estado actualizado correctamente',
      );

      await fetchTarifas();
    } catch (error) {
      setMessage(
        error?.message ||
          'Error inesperado al cambiar el estado',
      );

      setMessageType(
        'error',
      );
    } finally {
      setLoadingAction(false);
    }
  };

  /**
   * ============================================================
   * LIMPIAR FILTROS
   * ============================================================
   */
  const clearFilters = () => {
    setPage(1);

    setSearch('');

    setEstado('');
  };

  /**
   * ============================================================
   * RESUMEN
   * ============================================================
   */
  const resumen = useMemo(() => {
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
              ? tarifa
                  .rangosTarifa
                  .length
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
  }, [tarifas]);

  const messageClass =
    messageType === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">

        {/* ================= HEADER ================= */}

        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>
                Inicio
              </span>

              <span>/</span>

              <span>
                Configuración
              </span>

              <span>/</span>

              <span className="text-emerald-700">
                Tarifas
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de tarifas
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra las tarifas y
              define sus rangos de consumo.
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

        {/* ================= MÉTRICAS ================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total de tarifas"
            value={totalItems}
            icon={CurrencyDollarIcon}
          />

          <MetricCard
            label="Rangos visibles"
            value={
              resumen.totalRangos
            }
            icon={ChartBarIcon}
          />

          <MetricCard
            label="Activas visibles"
            value={resumen.activas}
            icon={CheckCircleIcon}
          />

          <MetricCard
            label="Inactivas visibles"
            value={resumen.inactivas}
            icon={PowerIcon}
          />
        </div>

        {/* ================= MENSAJE ================= */}

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-medium ${messageClass}`}
          >
            {message}
          </div>
        )}

        {/* ================= CONTENEDOR ================= */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* ================= FILTROS ================= */}

          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">

              <div>
                <h2 className="font-bold text-slate-900">
                  Tarifas registradas
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Consulta, edita y administra
                  el estado de las tarifas.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* BUSCAR */}

                <div className="relative w-full sm:w-80">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(
                      event,
                    ) => {
                      setPage(1);

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
                        setPage(1);

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
                  value={estado}
                  onChange={(
                    event,
                  ) => {
                    setPage(1);

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

          {/* ================= TABLA ================= */}

          <div className="overflow-x-auto">
            <table className="min-w-[950px] w-full text-left text-sm">
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
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
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
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center text-slate-500"
                    >
                      No existen tarifas.
                    </td>
                  </tr>
                ) : (
                  tarifas.map(
                    (tarifa) => {
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
                          className="hover:bg-slate-50"
                        >

                          {/* TARIFA */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                <BanknotesIcon className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {
                                    tarifa.nombre_tarifa
                                  }
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

                                    {
                                      rango.consumo_minimo
                                    }

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
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
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

          {/* ================= PAGINACIÓN ================= */}

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
            <p className="text-sm text-slate-500">
              Mostrando{' '}
              <strong>
                {tarifas.length}
              </strong>{' '}
              de{' '}
              <strong>
                {totalItems}
              </strong>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={
                  page <= 1 ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (previous) =>
                      previous - 1,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                {page}
              </span>

              <span className="text-sm text-slate-400">
                de {totalPages}
              </span>

              <button
                type="button"
                disabled={
                  page >=
                    totalPages ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (previous) =>
                      previous + 1,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-40"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      <TarifaModal
        open={modalOpen}
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