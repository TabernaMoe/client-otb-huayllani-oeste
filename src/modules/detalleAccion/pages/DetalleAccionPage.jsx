import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  PowerIcon,
  ReceiptPercentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  toast,
} from 'react-toastify';

import DetalleAccionModal
  from '../components/DetalleAccionModal';

import {
  DetalleAccionServices,
} from '../services/detalleAccion.services';

/**
 * ============================================================
 * FUNCIONES DEL SCHEMA
 * ============================================================
 */
import {
  validateDetalleAccionId,
  validateDetalleAccionParams,
} from '../schema/detalleAccion.schema';

/**
 * ============================================================
 * FORMATEAR PRECIO
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

/**
 * ============================================================
 * ESTILOS SEGÚN ESTADO
 * ============================================================
 */
const statusStyles = {
  active: {
    badge:
      'border-emerald-200 bg-emerald-50 text-emerald-700',

    dot:
      'bg-emerald-500',
  },

  inactive: {
    badge:
      'border-slate-200 bg-slate-100 text-slate-600',

    dot:
      'bg-slate-400',
  },
};

export default function DetalleAccionPage() {
  /**
   * ============================================================
   * DATOS
   * ============================================================
   */
  const [
    detalles,
    setDetalles,
  ] = useState([]);

  /**
   * ============================================================
   * PAGINACIÓN
   * ============================================================
   */
  const [
    page,
    setPage,
  ] = useState(1);

  const [
    limit,
  ] = useState(5);

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
   *
   * -> todos
   *
   * 'true'
   *
   * -> activos
   *
   * 'false'
   *
   * -> inactivos
   */
  const [
    estado,
    setEstado,
  ] = useState('');

  /**
   * ============================================================
   * LOADING
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

  /**
   * ============================================================
   * MODAL
   * ============================================================
   */
  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    selectedDetalle,
    setSelectedDetalle,
  ] = useState(null);

  /**
   * ============================================================
   * MENSAJES
   * ============================================================
   */
  const [
    message,
    setMessage,
  ] = useState('');

  const [
    messageType,
    setMessageType,
  ] = useState(
    'success',
  );

  /**
   * ============================================================
   * CONVERTIR ESTADO
   * ============================================================
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
   * OBTENER DETALLES
   * ============================================================
   */
  const fetchDetalles = async () => {
    try {
      setLoading(
        true,
      );

      setMessage('');

      /**
       * ========================================================
       * PASO 1
       * PREPARAR PARAMS
       * ========================================================
       */
      const params = {
        page,

        limit,

        search,

        estado:
          getEstadoValue(),
      };

      /**
       * ========================================================
       * PASO 2
       * VALIDAR PARAMS
       * ========================================================
       */
      const validation =
        validateDetalleAccionParams(
          params,
        );

      if (
        !validation.isValid
      ) {
        setMessage(
          'Los parámetros de búsqueda no son válidos',
        );

        setMessageType(
          'error',
        );

        setDetalles([]);

        setTotalItems(
          0,
        );

        setTotalPages(
          1,
        );

        return;
      }

      /**
       * ========================================================
       * PASO 3
       * SERVICE
       * ========================================================
       *
       * getAll() recibe UN objeto:
       *
       * {
       *   page,
       *   limit,
       *   search,
       *   estado
       * }
       */
      const response =
        await DetalleAccionServices.getAll(
          validation.data,
        );

      /**
       * ========================================================
       * PASO 4
       * ERROR DEL BACKEND
       * ========================================================
       */
      if (
        !response?.ok
      ) {
        setMessage(
          response?.message ||
            'Error al cargar los detalles de acción',
        );

        setMessageType(
          'error',
        );

        setDetalles([]);

        setTotalItems(
          0,
        );

        setTotalPages(
          1,
        );

        return;
      }

      /**
       * ========================================================
       * PASO 5
       * FILAS
       * ========================================================
       */
      setDetalles(
        Array.isArray(
          response.data,
        )
          ? response.data
          : [],
      );

      /**
       * ========================================================
       * PASO 6
       * PAGINACIÓN
       * ========================================================
       */
      setTotalItems(
        Number(
          response.total ??
            0,
        ),
      );

      setTotalPages(
        Number(
          response.totalPages ??
            1,
        ),
      );

    } catch (error) {
      setMessage(
        error?.message ||
          'Error inesperado al cargar los detalles',
      );

      setMessageType(
        'error',
      );

      setDetalles([]);

      setTotalItems(
        0,
      );

      setTotalPages(
        1,
      );

    } finally {
      setLoading(
        false,
      );
    }
  };

  /**
   * ============================================================
   * RECARGAR AUTOMÁTICAMENTE
   * ============================================================
   */
  useEffect(() => {
    fetchDetalles();
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
    setSelectedDetalle(
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
  const openEditModal = async (
    detalle,
  ) => {
    /**
     * ==========================================================
     * PASO 1
     * VALIDAR ID
     * ==========================================================
     */
    const validation =
      validateDetalleAccionId(
        detalle?.id,
      );

    if (
      !validation.isValid
    ) {
      setMessage(
        validation.error,
      );

      setMessageType(
        'error',
      );

      return;
    }

    try {
      setMessage('');

      /**
       * ========================================================
       * PASO 2
       * GET POR ID
       * ========================================================
       */
      const response =
        await DetalleAccionServices.getById(
          validation.data,
        );

      if (
        !response?.ok
      ) {
        setMessage(
          response?.message ||
            'Error al cargar el detalle',
        );

        setMessageType(
          'error',
        );

        return;
      }

      /**
       * ========================================================
       * PASO 3
       * OBTENER DATO
       * ========================================================
       *
       * Tu backend documentado devuelve:
       *
       * dato
       */
      const detalleCompleto =
        response.dato ??
        response.data;

      if (
        !detalleCompleto
      ) {
        setMessage(
          'No se encontró la información del detalle.',
        );

        setMessageType(
          'error',
        );

        return;
      }

      /**
       * ========================================================
       * PASO 4
       * ABRIR MODAL
       * ========================================================
       */
      setSelectedDetalle(
        detalleCompleto,
      );

      setModalOpen(
        true,
      );

    } catch (error) {
      setMessage(
        error?.message ||
          'Error inesperado al cargar el detalle',
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
    setModalOpen(
      false,
    );

    setSelectedDetalle(
      null,
    );
  };

  /**
   * ============================================================
   * GUARDADO CORRECTAMENTE
   * ============================================================
   */
  const handleSuccess = () => {
    /**
     * El modal ya muestra un toast,
     * por eso aquí solamente cerramos
     * y actualizamos.
     */
    closeModal();

    fetchDetalles();
  };

  /**
   * ============================================================
   * CAMBIAR ESTADO
   * ============================================================
   */
  const handleChangeEstado = async (
    detalle,
  ) => {
    /**
     * ==========================================================
     * PASO 1
     * VALIDAR ID
     * ==========================================================
     */
    const validation =
      validateDetalleAccionId(
        detalle?.id,
      );

    if (
      !validation.isValid
    ) {
      setMessage(
        validation.error,
      );

      setMessageType(
        'error',
      );

      return;
    }

    /**
     * Determinamos acción visual.
     */
    const accion =
      detalle.estado
        ? 'deshabilitar'
        : 'habilitar';

    /**
     * Confirmación.
     */
    const confirmacion =
      window.confirm(
        `¿Seguro que deseas ${accion} "${detalle.nombre_accion}"?`,
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

      setMessage('');

      /**
       * ========================================================
       * PASO 2
       * SERVICE
       * ========================================================
       */
      const response =
        await DetalleAccionServices.changeEstado(
          validation.data,
        );

      if (
        !response?.ok
      ) {
        setMessage(
          response?.message ||
            'Error al cambiar el estado',
        );

        setMessageType(
          'error',
        );

        return;
      }

      /**
       * ========================================================
       * PASO 3
       * ÉXITO
       * ========================================================
       */
      toast.success(
        response?.message ||
          'Estado actualizado correctamente',
      );

      /**
       * ========================================================
       * PASO 4
       * ACTUALIZAR
       * ========================================================
       */
      await fetchDetalles();

    } catch (error) {
      setMessage(
        error?.message ||
          'Error inesperado al cambiar el estado',
      );

      setMessageType(
        'error',
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
  const clearFilters = () => {
    setPage(
      1,
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
      const activos =
        detalles.filter(
          (
            item,
          ) =>
            Boolean(
              item.estado,
            ),
        ).length;

      const inactivos =
        detalles.filter(
          (
            item,
          ) =>
            !Boolean(
              item.estado,
            ),
        ).length;

      /**
       * Sumamos los precios
       * solamente de la página visible.
       */
      const totalVisible =
        detalles.reduce(
          (
            sum,
            item,
          ) =>
            sum +
            Number(
              item.precio_accion ||
                0,
            ),
          0,
        );

      return {
        visibles:
          detalles.length,

        activos,

        inactivos,

        totalVisible,
      };

    }, [
      detalles,
    ]);

  /**
   * ============================================================
   * CLASE DE MENSAJE
   * ============================================================
   */
  const messageClass =
    messageType ===
    'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

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
                Detalles de acción
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Detalles de pago por acción
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra los conceptos, precios y tipos de cobro asociados a las acciones.
            </p>

          </div>

          <button
            type="button"
            onClick={
              openCreateModal
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >

            <PlusIcon className="h-5 w-5" />

            Nuevo detalle

          </button>

        </header>

        {/* ====================================================
            MÉTRICAS
            ==================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            label="Total de detalles"
            value={
              totalItems
            }
            icon={
              ClipboardDocumentListIcon
            }
            iconClass="bg-slate-100 text-slate-700"
          />

          <MetricCard
            label="Activos visibles"
            value={
              resumen.activos
            }
            icon={
              CheckCircleIcon
            }
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            label="Inactivos visibles"
            value={
              resumen.inactivos
            }
            icon={
              PowerIcon
            }
            iconClass="bg-amber-50 text-amber-700"
          />

          <MetricCard
            label="Valor visible"
            value={
              formatMoney(
                resumen.totalVisible,
              )
            }
            icon={
              BanknotesIcon
            }
            iconClass="bg-blue-50 text-blue-700"
          />

        </div>

        {/* ====================================================
            MENSAJE
            ==================================================== */}

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-medium ${messageClass}`}
          >
            {message}
          </div>
        )}

        {/* ====================================================
            CONTENEDOR
            ==================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* ==================================================
              FILTROS
              ================================================== */}

          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">

            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">

              <div className="flex items-center gap-3">

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                  1
                </span>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Conceptos registrados
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Busca un detalle o filtra los registros por estado.
                  </p>

                </div>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* ==============================================
                    BUSCADOR
                    ============================================== */}

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
                      setPage(
                        1,
                      );

                      setSearch(
                        event.target.value,
                      );
                    }}
                    placeholder="Buscar detalle por nombre"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setPage(
                          1,
                        );

                        setSearch('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Limpiar búsqueda"
                    >

                      <XMarkIcon className="h-4 w-4" />

                    </button>
                  )}

                </div>

                {/* ==============================================
                    ESTADO
                    ============================================== */}

                <select
                  value={
                    estado
                  }
                  onChange={(
                    event,
                  ) => {
                    setPage(
                      1,
                    );

                    setEstado(
                      event.target.value,
                    );
                  }}
                  className="min-w-40 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                >

                  <option value="">
                    Todos
                  </option>

                  <option value="true">
                    Activos
                  </option>

                  <option value="false">
                    Inactivos
                  </option>

                </select>

                {/* ==============================================
                    LIMPIAR
                    ============================================== */}

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
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
                    Detalle
                  </th>

                  <th className="px-4 py-4">
                    Código
                  </th>

                  <th className="px-4 py-4">
                    Precio
                  </th>

                  <th className="px-4 py-4">
                    Tipo de cobro
                  </th>

                  <th className="px-4 py-4">
                    Tipo de acción
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

                {/* ==============================================
                    LOADING
                    ============================================== */}

                {loading ? (
                  <tr>

                    <td
                      colSpan={7}
                      className="px-6 py-16"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Cargando detalles...
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : detalles.length ===
                  0 ? (

                  /**
                   * ============================================
                   * SIN DATOS
                   * ============================================
                   */

                  <tr>

                    <td
                      colSpan={7}
                      className="px-6 py-16"
                    >

                      <div className="flex flex-col items-center justify-center text-center">

                        <div className="rounded-full bg-slate-100 p-4 text-slate-400">

                          <ClipboardDocumentListIcon className="h-8 w-8" />

                        </div>

                        <h3 className="mt-4 font-bold text-slate-700">
                          No se encontraron detalles
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                          No existen registros con los filtros seleccionados.
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  /**
                   * ============================================
                   * REGISTROS
                   * ============================================
                   */

                  detalles.map(
                    (
                      detalle,
                    ) => {
                      const activo =
                        Boolean(
                          detalle.estado,
                        );

                      const styles =
                        activo
                          ? statusStyles.active
                          : statusStyles.inactive;

                      return (
                        <tr
                          key={
                            detalle.id
                          }
                          className="transition hover:bg-slate-50/80"
                        >

                          {/* ====================================
                              DETALLE
                              ==================================== */}

                          <td className="px-6 py-4">

                            <div className="flex min-w-64 items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">

                                <ReceiptPercentIcon className="h-5 w-5" />

                              </div>

                              <div>

                                <p className="font-bold text-slate-900">

                                  {detalle.nombre_accion ||
                                    'Sin nombre'}

                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                  Concepto de cobro para acciones
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* ====================================
                              CÓDIGO
                              ==================================== */}

                          <td className="px-4 py-4">

                            <span className="font-semibold text-slate-600">

                              #

                              {String(
                                detalle.id,
                              ).padStart(
                                4,
                                '0',
                              )}

                            </span>

                          </td>

                          {/* ====================================
                              PRECIO
                              ==================================== */}

                          <td className="px-4 py-4">

                            <span className="font-bold text-emerald-700">

                              {formatMoney(
                                detalle.precio_accion,
                              )}

                            </span>

                          </td>

                          {/* ====================================
                              TIPO COBRO
                              ==================================== */}

                          <td className="px-4 py-4">

                            <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">

                              {detalle.tipo_cobro ||
                                'Sin tipo'}

                            </span>

                          </td>

                          {/* ====================================
                              TIPO ACCIÓN
                              ==================================== */}

                          <td className="px-4 py-4">

                            <span className="font-medium text-slate-600">

                              {detalle.nombre_tipo_accion ||
                                '-'}

                            </span>

                          </td>

                          {/* ====================================
                              ESTADO
                              ==================================== */}

                          <td className="px-4 py-4">

                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${styles.badge}`}
                            >

                              <span
                                className={`h-2 w-2 rounded-full ${styles.dot}`}
                              />

                              {activo
                                ? 'Activo'
                                : 'Inactivo'}

                            </span>

                          </td>

                          {/* ====================================
                              ACCIONES
                              ==================================== */}

                          <td className="px-6 py-4">

                            <div className="flex justify-end gap-2">

                              {/* EDITAR */}

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    detalle,
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                title="Editar detalle"
                              >

                                <PencilSquareIcon className="h-4 w-4" />

                                Editar

                              </button>

                              {/* CAMBIAR ESTADO */}

                              <button
                                type="button"
                                disabled={
                                  loadingAction
                                }
                                onClick={() =>
                                  handleChangeEstado(
                                    detalle,
                                  )
                                }
                                className={`rounded-lg border p-2 transition ${
                                  activo
                                    ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                } disabled:cursor-not-allowed disabled:opacity-50`}
                                title={
                                  activo
                                    ? 'Deshabilitar'
                                    : 'Habilitar'
                                }
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

          <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">

            <p className="text-sm text-slate-500">

              Mostrando{' '}

              <span className="font-semibold text-slate-700">
                {detalles.length}
              </span>

              {' '}de{' '}

              <span className="font-semibold text-slate-700">
                {totalItems}
              </span>

              {' '}registros

            </p>

            <div className="flex items-center gap-2">

              {/* ANTERIOR */}

              <button
                type="button"
                disabled={
                  page <=
                    1 ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (
                      previous,
                    ) =>
                      previous -
                      1,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página anterior"
              >

                <ChevronLeftIcon className="h-4 w-4" />

              </button>

              {/* PÁGINA */}

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-bold text-emerald-700">
                {page}
              </span>

              <span className="px-1 text-sm text-slate-400">

                de{' '}

                {totalPages}

              </span>

              {/* SIGUIENTE */}

              <button
                type="button"
                disabled={
                  page >=
                    totalPages ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (
                      previous,
                    ) =>
                      previous +
                      1,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página siguiente"
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

      <DetalleAccionModal
        open={
          modalOpen
        }
        detalle={
          selectedDetalle
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