import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  CheckCircleIcon,
  CreditCardIcon,
  IdentificationIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilSquareIcon,
  PlusIcon,
  SignalIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

import {
  toast,
} from 'react-toastify';

import {
  AccionesServices as Servs,
} from '../services/acciones.services';

import AccionModal
  from '../components/AccionModal';
import {
  CallesServices
} from '../../calles/services/calles.services';

/**
 * ============================================================
 * FUNCIONES DE VALIDACIÓN
 * ============================================================
 *
 * El Page no importa schemas directamente.
 *
 * Solamente funciones.
 */
import {
  validateAccionId,
  validateAccionParams,
} from '../schema/acciones.schema';

/**
 * ============================================================
 * OBTENER NOMBRE DEL SOCIO
 * ============================================================
 *
 * El listado de tu backend devuelve:
 *
 * nombre_completo
 */
const getSocioName = (
  accion,
) =>
  accion?.nombre_completo ||
  accion?.socio?.nombre_completo ||
  [
    accion?.socio?.nombres,
    accion?.socio?.primer_apellido,
    accion?.socio?.segundo_apellido,
  ]
    .filter(Boolean)
    .join(' ') ||
  'Socio sin nombre';

/**
 * ============================================================
 * OBTENER INICIALES
 * ============================================================
 */
const getSocioInitials = (
  accion,
) =>
  getSocioName(
    accion,
  )
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (palabra) =>
        palabra
          .charAt(0)
          .toUpperCase(),
    )
    .join('');

/**
 * ============================================================
 * CALLE
 * ============================================================
 */
const getCalleName = (
  accion,
) =>
  accion?.nombre_calle ||
  accion?.calle?.nombre_calle ||
  '-';

/**
 * ============================================================
 * TARIFA
 * ============================================================
 */
const getTarifaName = (
  accion,
) =>
  accion?.nombre_tarifa ||
  accion?.tarifa?.nombre_tarifa ||
  '-';

/**
 * ============================================================
 * ESTILOS
 * ============================================================
 */
const estadoStyles = {
  ACTIVO: {
    badge:
      'border-emerald-200 bg-emerald-50 text-emerald-700',

    dot:
      'bg-emerald-500',
  },

  PASIVO: {
    badge:
      'border-amber-200 bg-amber-50 text-amber-700',

    dot:
      'bg-amber-500',
  },

  ANULADO: {
    badge:
      'border-red-200 bg-red-50 text-red-700',

    dot:
      'bg-red-500',
  },
};

export default function AccionesPage() {
  /**
   * ============================================================
   * DATOS
   * ============================================================
   */

  const [
    acciones,
    setAcciones,
  ] = useState([]);

  /**
   * Acción seleccionada
   * para editar.
   */
  const [
    selected,
    setSelected,
  ] = useState(null);

  /**
   * Control del modal.
   */
  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

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
   * FILTROS
   * ============================================================
   */
  const [
    search,
    setSearch,
  ] = useState('');

  const [
    estado,
    setEstado,
  ] = useState(
    'ACTIVO',
  );

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
   * OBTENER ACCIONES
   * ============================================================
   */
  const fetchAcciones =
    async () => {
      try {
        setLoading(
          true,
        );

        /**
         * ======================================================
         * PASO 1
         * PREPARAMOS LOS PARÁMETROS
         * ======================================================
         */
        const params = {
          page:
            pagination.page,

          limit:
            pagination.limit,

          search,

          estado,
        };

        /**
         * ======================================================
         * PASO 2
         * VALIDAMOS
         * ======================================================
         *
         * El Page solamente utiliza:
         *
         * validateAccionParams()
         *
         * No usa safeParse().
         */
        const validation =
          validateAccionParams(
            params,
          );

        /**
         * Si algo está incorrecto,
         * detenemos la petición.
         */
        if (
          !validation.isValid
        ) {
          toast.error(
            'Los parámetros de búsqueda no son válidos',
          );

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
         * getAll recibe UN OBJETO.
         *
         * No:
         *
         * getAll(
         *   page,
         *   limit,
         *   search,
         *   estado
         * )
         */
        const response =
          await Servs.getAll(
            validation.data,
          );

        /**
         * ======================================================
         * PASO 4
         * ERROR DEL BACKEND
         * ======================================================
         */
        if (
          !response?.ok
        ) {
          toast.error(
            response?.message ||
              'Error al cargar las acciones',
          );

          setAcciones([]);

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
         * GUARDAMOS LOS REGISTROS
         * ======================================================
         */
        setAcciones(
          Array.isArray(
            response.data,
          )
            ? response.data
            : [],
        );

        /**
         * ======================================================
         * PASO 6
         * PAGINACIÓN
         * ======================================================
         *
         * Según tu backend:
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
            'Error inesperado al cargar las acciones',
        );

      } finally {
        setLoading(
          false,
        );
      }
    };

  /**
   * ============================================================
   * CARGA AUTOMÁTICA
   * ============================================================
   *
   * Se vuelve a consultar cuando cambia:
   *
   * - página
   * - límite
   * - búsqueda
   * - estado
   */
  useEffect(() => {
    fetchAcciones();
  }, [
    pagination.page,
    pagination.limit,
    search,
    estado,
  ]);

  /**
   * ============================================================
   * NUEVA ACCIÓN
   * ============================================================
   */
  const openCreate = () => {
    /**
     * No tenemos acción seleccionada.
     */
    setSelected(
      null,
    );

    /**
     * Abrimos modal.
     */
    setModalOpen(
      true,
    );
  };

  /**
   * ============================================================
   * EDITAR
   * ============================================================
   *
   * Primero hacemos GET /accion/:id
   *
   * porque necesitamos:
   *
   * detallesAccion
   */
  const openEdit = async (
    accion,
  ) => {
    try {
      /**
       * ========================================================
       * PASO 1
       * VALIDAR ID
       * ========================================================
       */
      const validation =
        validateAccionId(
          accion?.id,
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
       * ========================================================
       * PASO 2
       * CONSULTAR ACCIÓN COMPLETA
       * ========================================================
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
            'Error al obtener la acción',
        );

        return;
      }

      /**
       * ========================================================
       * PASO 3
       * GUARDAMOS LA ACCIÓN
       * ========================================================
       */
      setSelected(
        response.data,
      );

      /**
       * Abrimos modal.
       */
      setModalOpen(
        true,
      );

    } catch (error) {
      toast.error(
        error?.message ||
          'Error inesperado al obtener la acción',
      );
    }
  };

  /**
   * ============================================================
   * OPERACIÓN EXITOSA DEL MODAL
   * ============================================================
   */
  const handleSaved = async () => {
    /**
     * Cerramos modal.
     */
    setModalOpen(
      false,
    );

    /**
     * Limpiamos selección.
     */
    setSelected(
      null,
    );

    /**
     * Recargamos tabla.
     */
    await fetchAcciones();
  };

  /**
   * ============================================================
   * BUSCAR
   * ============================================================
   */
  const handleSearchChange = (
    event,
  ) => {
    /**
     * Si cambia búsqueda,
     * regresamos a página 1.
     */
    setPagination(
      (previous) => ({
        ...previous,

        page: 1,
      }),
    );

    setSearch(
      event.target.value,
    );
  };

  /**
   * ============================================================
   * CAMBIAR ESTADO DEL FILTRO
   * ============================================================
   */
  const handleEstadoChange = (
    event,
  ) => {
    setPagination(
      (previous) => ({
        ...previous,

        page: 1,
      }),
    );

    setEstado(
      event.target.value,
    );
  };

  /**
   * ============================================================
   * LIMPIAR FILTROS
   * ============================================================
   */
  const clearFilters = () => {
    setPagination(
      (previous) => ({
        ...previous,

        page: 1,
      }),
    );

    setSearch('');

    setEstado(
      'ACTIVO',
    );
  };

  /**
   * ============================================================
   * MÉTRICAS
   * ============================================================
   *
   * Estos valores corresponden
   * solamente a las filas visibles.
   */
  const resumen =
    useMemo(() => {
      const activos =
        acciones.filter(
          (accion) =>
            accion.estado ===
            'ACTIVO',
        ).length;

      const pasivos =
        acciones.filter(
          (accion) =>
            accion.estado ===
            'PASIVO',
        ).length;

      const anulados =
        acciones.filter(
          (accion) =>
            accion.estado ===
            'ANULADO',
        ).length;

      return {
        visibles:
          acciones.length,

        activos,

        pasivos,

        anulados,
      };
    }, [
      acciones,
    ]);

  return (
    <section className="space-y-5">

      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Gestión de acciones
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Administra las conexiones, medidores y datos asociados a cada socio.
          </p>

        </div>

        <button
          type="button"
          onClick={
            openCreate
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >

          <PlusIcon className="h-5 w-5" />

          Nueva acción

        </button>

      </div>

      {/* ======================================================
          MÉTRICAS
          ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          label="Total acciones"
          value={
            pagination.totalItems
          }
          icon={
            CreditCardIcon
          }
        />

        <MetricCard
          label="Visibles"
          value={
            resumen.visibles
          }
          icon={
            UsersIcon
          }
        />

        <MetricCard
          label="Activas visibles"
          value={
            resumen.activos
          }
          icon={
            CheckCircleIcon
          }
        />

        <MetricCard
          label="Filtro actual"
          value={
            estado
          }
          icon={
            SignalIcon
          }
        />

      </div>

      {/* ======================================================
          FILTROS
          ====================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* BÚSQUEDA */}

          <div className="relative flex-1">

            <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={
                search
              }
              onChange={
                handleSearchChange
              }
              placeholder="Buscar socio, medidor o dirección"
              className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
            />

          </div>

          {/* ESTADO */}

          <select
            value={
              estado
            }
            onChange={
              handleEstadoChange
            }
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
          >

            <option value="ACTIVO">
              Activas
            </option>

            <option value="PASIVO">
              Pasivas
            </option>

            <option value="ANULADO">
              Anuladas
            </option>

          </select>

          {/* LIMPIAR */}

          <button
            type="button"
            onClick={
              clearFilters
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >

            <ArrowPathIcon className="h-4 w-4" />

            Limpiar

          </button>

        </div>

      </div>

      {/* ======================================================
          TABLA
          ====================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-250 text-left text-sm">

            {/* CABECERA */}

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-6 py-4">
                  Socio
                </th>

                <th className="px-4 py-4">
                  Medidor
                </th>

                <th className="px-4 py-4">
                  Calle
                </th>

                <th className="px-4 py-4">
                  Dirección
                </th>

                <th className="px-4 py-4">
                  Tarifa
                </th>

                <th className="px-4 py-4">
                  Estado
                </th>

                <th className="px-6 py-4 text-right">
                  Acciones
                </th>

              </tr>

            </thead>

            {/* CUERPO */}

            <tbody className="divide-y divide-slate-100">

              {/* LOADING */}

              {loading && (
                <tr>

                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center"
                  >

                    <ArrowPathIcon className="mx-auto h-7 w-7 animate-spin text-emerald-700" />

                    <p className="mt-3 text-sm text-slate-500">
                      Cargando acciones...
                    </p>

                  </td>

                </tr>
              )}

              {/* SIN RESULTADOS */}

              {!loading &&
                acciones.length ===
                  0 && (
                  <tr>

                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-slate-500"
                    >
                      No se encontraron acciones
                    </td>

                  </tr>
                )}

              {/* REGISTROS */}

              {!loading &&
                acciones.map(
                  (
                    accion,
                  ) => {
                    const styles =
                      estadoStyles[
                        accion.estado
                      ] ||
                      estadoStyles.ANULADO;

                    return (
                      <tr
                        key={
                          accion.id
                        }
                        className="transition hover:bg-slate-50"
                      >

                        {/* SOCIO */}

                        <td className="px-6 py-4">

                          <div className="flex min-w-60 items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                              {getSocioInitials(
                                accion,
                              ) ||
                                'S'}
                            </div>

                            <div>

                              <p className="font-bold text-slate-900">
                                {getSocioName(
                                  accion,
                                )}
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">

                                <IdentificationIcon className="h-3.5 w-3.5" />

                                Código interno:{' '}

                                {accion.codigo_interno ??
                                  '-'}

                              </p>

                            </div>

                          </div>

                        </td>

                        {/* MEDIDOR */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-2">

                            <SignalIcon className="h-4 w-4 text-slate-400" />

                            <span className="font-semibold text-slate-700">
                              {accion.nro_medidor ||
                                '-'}
                            </span>

                          </div>

                        </td>

                        {/* CALLE */}

                        <td className="px-4 py-4 text-slate-600">
                          {getCalleName(
                            accion,
                          )}
                        </td>

                        {/* DIRECCIÓN */}

                        <td className="px-4 py-4">

                          <div className="flex max-w-60 items-start gap-2 text-slate-600">

                            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                            {accion.direccion ||
                              '-'}

                          </div>

                        </td>

                        {/* TARIFA */}

                        <td className="px-4 py-4 text-slate-600">
                          {getTarifaName(
                            accion,
                          )}
                        </td>

                        {/* ESTADO */}

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${styles.badge}`}
                          >

                            <span
                              className={`h-2 w-2 rounded-full ${styles.dot}`}
                            />

                            {accion.estado}

                          </span>

                        </td>

                        {/* ACCIONES */}

                        <td className="px-6 py-4">

                          <div className="flex justify-end">

                            <button
                              type="button"
                              onClick={() =>
                                openEdit(
                                  accion,
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >

                              <PencilSquareIcon className="h-4 w-4" />

                              Editar

                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  },
                )}

            </tbody>

          </table>

        </div>

        {/* ====================================================
            PAGINACIÓN
            ==================================================== */}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">

            Mostrando{' '}

            <strong className="text-slate-700">
              {acciones.length}
            </strong>

            {' '}de{' '}

            <strong className="text-slate-700">
              {
                pagination.totalItems
              }
            </strong>

          </p>

          <div className="flex items-center gap-3">

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
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            {/* INFORMACIÓN */}

            <span className="text-sm font-semibold text-slate-700">

              Página{' '}

              {
                pagination.page
              }

              {' '}de{' '}

              {
                pagination.totalPages
              }

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
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>

          </div>

        </div>

      </div>

      {/* ======================================================
          MODAL
          ====================================================== */}

      <AccionModal
        open={
          modalOpen
        }
        selected={
          selected
        }
        onClose={() => {
          setModalOpen(
            false,
          );

          setSelected(
            null,
          );
        }}
        onSaved={
          handleSaved
        }
      />

    </section>
  );
}

/**
 * ============================================================
 * COMPONENTE DE MÉTRICA
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