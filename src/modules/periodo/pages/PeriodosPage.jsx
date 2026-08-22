import { useEffect, useMemo, useState } from 'react';

import {
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  LockClosedIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';

import { toast } from 'react-toastify';

import { PeriodosServices } from '../services/periodos.services';

import { cerrarPeriodoSchema } from '../schema/peridos.schema';

const MONTHS = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  setiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12',
};

/**
 * Convierte:
 *
 * 1 de enero de 2026
 *
 * en:
 *
 * 01/01/2026
 */
const formatDateOnly = (value) => {
  if (
    !value ||
    value === 'Sin fecha'
  ) {
    return '-';
  }

  const match = String(value)
    .toLowerCase()
    .match(
      /(\d{1,2}) de ([a-záéíóúñ]+) de (\d{4})/,
    );

  if (!match) {
    return value;
  }

  const day =
    match[1].padStart(2, '0');

  const month =
    MONTHS[match[2]];

  const year =
    match[3];

  if (!month) {
    return value;
  }

  return `${day}/${month}/${year}`;
};

/**
 * ============================================================
 * ESTILOS SEGÚN ESTADO
 * ============================================================
 */
const getStatusStyles = (estado) => {
  if (estado === 'CERRADO') {
    return {
      badge:
        'border-slate-200 bg-slate-100 text-slate-600',

      dot:
        'bg-slate-400',
    };
  }

  if (estado === 'ACTIVO') {
    return {
      badge:
        'border-emerald-200 bg-emerald-50 text-emerald-700',

      dot:
        'bg-emerald-500',
    };
  }

  return {
    badge:
      'border-amber-200 bg-amber-50 text-amber-700',

    dot:
      'bg-amber-500',
  };
};

export default function PeriodosPage() {
  /**
   * ============================================================
   * DATOS
   * ============================================================
   */

  const [periodos, setPeriodos] =
    useState([]);

  /**
   * ============================================================
   * ESTADOS UI
   * ============================================================
   */

  const [loading, setLoading] =
    useState(false);

  const [closingId, setClosingId] =
    useState(null);

  /**
   * ============================================================
   * PAGINACIÓN
   * ============================================================
   */

  const [page, setPage] =
    useState(1);

  const [limit] =
    useState(10);

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
   * OBTENER PERIODOS
   * ============================================================
   */
  const fetchPeriodos = async () => {
    try {
      setLoading(true);

      const response =
        await PeriodosServices.getAll(
          page,
          limit,
        );

      if (!response?.ok) {
        toast.error(
          response?.message ||
            'Error al cargar los periodos',
        );

        setPeriodos([]);

        setTotalPages(1);

        setTotalItems(0);

        return;
      }

      setPeriodos(
        Array.isArray(response.data)
          ? response.data
          : [],
      );

      setTotalPages(
        Number(
          response.totalPages || 1,
        ),
      );

      setTotalItems(
        Number(
          response.total || 0,
        ),
      );
    } catch (error) {
      toast.error(
        error?.message ||
          'Error inesperado al cargar los periodos',
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cuando cambia la página,
   * volvemos a consultar.
   */
  useEffect(() => {
    fetchPeriodos();
  }, [page]);

  /**
   * ============================================================
   * RESUMEN
   * ============================================================
   */
  const resumen = useMemo(() => {
    const activos =
      periodos.filter(
        (periodo) =>
          periodo.estado ===
          'ACTIVO',
      ).length;

    const cerrados =
      periodos.filter(
        (periodo) =>
          periodo.estado ===
          'CERRADO',
      ).length;

    const pendientes =
      periodos.filter(
        (periodo) =>
          periodo.estado ===
          'PENDIENTE',
      ).length;

    return {
      visibles:
        periodos.length,

      activos,

      cerrados,

      pendientes,
    };
  }, [periodos]);

  /**
   * ============================================================
   * CERRAR PERIODO
   * ============================================================
   */
  const handleCerrarPeriodo = async (
    periodo,
  ) => {
    /**
     * Primera protección.
     *
     * Solo ACTIVO puede cerrarse.
     */
    if (
      periodo.estado !== 'ACTIVO'
    ) {
      toast.info(
        'Solo se puede cerrar un periodo activo',
      );

      return;
    }

    /**
     * Validamos el ID.
     */
    const validation =
      cerrarPeriodoSchema.safeParse({
        id: periodo.id,
      });

    if (!validation.success) {
      toast.error(
        'El periodo seleccionado no es válido',
      );

      return;
    }

    const confirmClose =
      window.confirm(
        `¿Seguro que deseas cerrar el periodo ${periodo.mes}?`,
      );

    if (!confirmClose) {
      return;
    }

    try {
      setClosingId(
        validation.data.id,
      );

      const response =
        await PeriodosServices.cerrar(
          validation.data.id,
        );

      if (!response?.ok) {
        toast.error(
          response?.message ||
            'No se pudo cerrar el periodo',
        );

        return;
      }

      toast.success(
        response?.message ||
          'Periodo cerrado correctamente',
      );

      await fetchPeriodos();
    } catch (error) {
      toast.error(
        error?.message ||
          'Error inesperado al cerrar el periodo',
      );
    } finally {
      setClosingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">

        {/* ================= ENCABEZADO ================= */}

        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>
                Inicio
              </span>

              <span>/</span>

              <span>
                Agua
              </span>

              <span>/</span>

              <span className="text-emerald-700">
                Periodos
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de periodos
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Consulta los periodos mensuales
              y controla el cierre del periodo activo.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPeriodos}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-5 w-5 ${
                loading
                  ? 'animate-spin'
                  : ''
              }`}
            />

            Actualizar periodos
          </button>
        </header>

        {/* ================= TARJETAS ================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total de periodos"
            value={totalItems}
            icon={RectangleStackIcon}
            iconClass="bg-slate-100 text-slate-700"
          />

          <MetricCard
            label="Activos visibles"
            value={resumen.activos}
            icon={CheckCircleIcon}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            label="Pendientes visibles"
            value={resumen.pendientes}
            icon={ClockIcon}
            iconClass="bg-amber-50 text-amber-700"
          />

          <MetricCard
            label="Cerrados visibles"
            value={resumen.cerrados}
            icon={LockClosedIcon}
            iconClass="bg-blue-50 text-blue-700"
          />
        </div>

        {/* ================= TABLA ================= */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                1
              </span>

              <div>
                <h2 className="font-bold text-slate-900">
                  Periodos registrados
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Solamente el periodo ACTIVO
                  puede ser cerrado.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-225 w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">
                    Periodo
                  </th>

                  <th className="px-4 py-4">
                    Código
                  </th>

                  <th className="px-4 py-4">
                    Fecha de inicio
                  </th>

                  <th className="px-4 py-4">
                    Fecha de finalización
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
                      colSpan="6"
                      className="px-6 py-16"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Cargando periodos...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : periodos.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16"
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <CalendarDaysIcon className="h-8 w-8 text-slate-300" />

                        <h3 className="mt-4 font-bold text-slate-700">
                          No hay periodos registrados
                        </h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  periodos.map(
                    (periodo) => {
                      const puedeCerrar =
                        periodo.estado ===
                        'ACTIVO';

                      const cerrando =
                        closingId ===
                        periodo.id;

                      const statusStyles =
                        getStatusStyles(
                          periodo.estado,
                        );

                      return (
                        <tr
                          key={
                            periodo.id
                          }
                          className="transition hover:bg-slate-50/80"
                        >
                          {/* PERIODO */}

                          <td className="px-6 py-4">
                            <div className="flex min-w-52 items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                <CalendarDaysIcon className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {
                                    periodo.mes
                                  }
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                  Periodo mensual
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* ID */}

                          <td className="px-4 py-4">
                            <span className="font-semibold text-slate-600">
                              #
                              {String(
                                periodo.id,
                              ).padStart(
                                4,
                                '0',
                              )}
                            </span>
                          </td>

                          {/* INICIO */}

                          <td className="px-4 py-4 text-slate-600">
                            {formatDateOnly(
                              periodo.fecha_inicio,
                            )}
                          </td>

                          {/* FIN */}

                          <td className="px-4 py-4 text-slate-600">
                            {formatDateOnly(
                              periodo.fecha_fin,
                            )}
                          </td>

                          {/* ESTADO */}

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyles.badge}`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${statusStyles.dot}`}
                              />

                              {
                                periodo.estado
                              }
                            </span>
                          </td>

                          {/* ACCIÓN */}

                          <td className="px-6 py-4">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                disabled={
                                  !puedeCerrar ||
                                  cerrando
                                }
                                onClick={() =>
                                  handleCerrarPeriodo(
                                    periodo,
                                  )
                                }
                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                  puedeCerrar
                                    ? 'border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50'
                                    : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                                } disabled:opacity-60`}
                              >
                                {cerrando ? (
                                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                ) : puedeCerrar ? (
                                  <LockClosedIcon className="h-4 w-4" />
                                ) : (
                                  <ClockIcon className="h-4 w-4" />
                                )}

                                {cerrando
                                  ? 'Cerrando...'
                                  : puedeCerrar
                                    ? 'Cerrar periodo'
                                    : periodo.estado}
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

          <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <p className="text-sm text-slate-500">
              Mostrando{' '}
              <span className="font-semibold text-slate-700">
                {periodos.length}
              </span>{' '}
              de{' '}
              <span className="font-semibold text-slate-700">
                {totalItems}
              </span>{' '}
              periodos
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
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-bold text-emerald-700">
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
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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