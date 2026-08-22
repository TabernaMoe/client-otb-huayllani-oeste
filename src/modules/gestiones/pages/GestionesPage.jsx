import { useEffect, useMemo, useState } from 'react';

import {
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { GestionesServices } from '../services/gestiones.services';

import { validateGestionForm } from '../schema/gestiones.schema';

const initialForm = {
  anio: '',
};

const inputClass = (hasError = false) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
  }`;

export default function GestionesPage() {
  /**
   * ============================================================
   * DATOS
   * ============================================================
   */

  const [gestiones, setGestiones] =
    useState([]);

  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  /**
   * ============================================================
   * PAGINACIÓN
   * ============================================================
   */

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalItems, setTotalItems] =
    useState(0);

  /**
   * ============================================================
   * BÚSQUEDA
   * ============================================================
   */

  const [search, setSearch] =
    useState('');

  /**
   * ============================================================
   * INTERFAZ
   * ============================================================
   */

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [messageType, setMessageType] =
    useState('success');

  /**
   * ============================================================
   * OBTENER GESTIONES
   * ============================================================
   */
  const fetchGestiones = async () => {
    try {
      setLoading(true);

      setMessage('');

      const response =
        await GestionesServices.getAll(
          page,
          limit,
          search,
        );

      if (!response?.ok) {
        setMessage(
          response?.message ||
            'Error al cargar las gestiones',
        );

        setMessageType('error');

        setGestiones([]);

        setTotalItems(0);

        setTotalPages(1);

        return;
      }

      setGestiones(
        Array.isArray(response.data)
          ? response.data
          : [],
      );

      setTotalItems(
        Number(response.total || 0),
      );

      setTotalPages(
        Number(response.totalPages || 1),
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Consultamos nuevamente cuando cambia:
   *
   * - página
   * - límite
   * - búsqueda
   */
  useEffect(() => {
    fetchGestiones();
  }, [
    page,
    limit,
    search,
  ]);

  /**
   * ============================================================
   * ABRIR MODAL
   * ============================================================
   */
  const openModal = () => {
    setForm(initialForm);

    setErrors({});

    setMessage('');

    setModalOpen(true);
  };

  /**
   * ============================================================
   * CERRAR MODAL
   * ============================================================
   */
  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);

    setForm(initialForm);

    setErrors({});
  };

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

      [name]: '',
    }));

    setMessage('');
  };

  /**
   * ============================================================
   * CREAR GESTIÓN
   * ============================================================
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation =
      validateGestionForm(form);

    if (!validation.isValid) {
      setErrors(
        validation.errors,
      );

      setMessage(
        'Revise los campos marcados antes de guardar.',
      );

      setMessageType('error');

      return;
    }

    try {
      setSaving(true);

      setMessage('');

      const response =
        await GestionesServices.create(
          validation.data,
        );

      if (!response?.ok) {
        setMessage(
          response?.message ||
            'Error al crear la gestión',
        );

        setMessageType('error');

        return;
      }

      setModalOpen(false);

      setForm(initialForm);

      setErrors({});

      setMessage(
        response?.message ||
          'Gestión creada correctamente',
      );

      setMessageType('success');

      /**
       * Volvemos a la primera página para
       * visualizar la nueva gestión.
       */
      setPage(1);

      await fetchGestiones();
    } finally {
      setSaving(false);
    }
  };

  /**
   * ============================================================
   * RESUMEN
   * ============================================================
   */

  const resumen = useMemo(() => {
    const activas =
      gestiones.filter(
        (gestion) =>
          gestion.estado === 'ACTIVO',
      ).length;

    const inactivas =
      gestiones.filter(
        (gestion) =>
          gestion.estado !== 'ACTIVO',
      ).length;

    const anios = gestiones
      .map(
        (gestion) =>
          Number(gestion.anio),
      )
      .filter(Boolean);

    return {
      visibles: gestiones.length,

      activas,

      inactivas,

      ultima:
        anios.length > 0
          ? Math.max(...anios)
          : '-',
    };
  }, [gestiones]);

  const messageClasses =
    messageType === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">

        {/* ================= ENCABEZADO ================= */}

        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Inicio</span>

              <span>/</span>

              <span>
                Configuración
              </span>

              <span>/</span>

              <span className="text-emerald-700">
                Gestiones
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de periodos anuales
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra las gestiones anuales
              utilizadas por el sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" />

            Nueva gestión
          </button>
        </header>

        {/* ================= RESUMEN ================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total registros"
            value={totalItems}
            icon={CalendarDaysIcon}
            iconClass="bg-slate-100 text-slate-700"
          />

          <MetricCard
            label="Activas visibles"
            value={resumen.activas}
            icon={CheckCircleIcon}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            label="Inactivas visibles"
            value={resumen.inactivas}
            icon={CalendarDaysIcon}
            iconClass="bg-amber-50 text-amber-700"
          />

          <MetricCard
            label="Última visible"
            value={resumen.ultima}
            icon={CalendarDaysIcon}
            iconClass="bg-blue-50 text-blue-700"
          />
        </div>

        {/* ================= MENSAJE ================= */}

        {message && (
          <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${messageClasses}`}
          >
            {messageType ===
            'error' ? (
              <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            )}

            <span>
              {message}
            </span>
          </div>
        )}

        {/* ================= BUSCADOR ================= */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="w-full lg:max-w-md">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Buscar gestión
            </label>

            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setPage(1);

                  setSearch(
                    event.target.value,
                  );
                }}
                placeholder="Ej. 2026"
                className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');

                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= TABLA ================= */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-900">
                  Gestiones registradas
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Consulta los periodos
                  disponibles.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchGestiones}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
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
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
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
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-16 text-center text-sm text-slate-500"
                    >
                      No hay gestiones
                      registradas.
                    </td>
                  </tr>
                ) : (
                  gestiones.map(
                    (gestion) => (
                      <tr
                        key={
                          gestion.id
                        }
                        className="hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-bold text-slate-900">
                          Gestión{' '}
                          {
                            gestion.anio
                          }
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {formatDate(
                            gestion.fecha_inicio,
                          )}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {formatDate(
                            gestion.fecha_fin,
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            {
                              gestion.estado
                            }
                          </span>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINACIÓN ================= */}

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
            <span className="text-sm text-slate-500">
              Página {page} de{' '}
              {totalPages}
            </span>

            <div className="flex gap-2">
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
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={
                  page >= totalPages ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (previous) =>
                      previous + 1,
                  )
                }
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Registrar gestión
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Ingrese el año de
                  la nueva gestión.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <label className="mb-2 block text-sm font-semibold">
                  Año
                </label>

                <div className="relative">
                  <CalendarDaysIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="number"
                    name="anio"
                    value={form.anio}
                    onChange={
                      handleChange
                    }
                    placeholder="Ej. 2027"
                    className={`${inputClass(
                      Boolean(
                        errors.anio,
                      ),
                    )} pl-11`}
                  />
                </div>

                {errors.anio && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.anio}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border px-5 py-3 text-sm font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
                >
                  {saving
                    ? 'Guardando...'
                    : 'Registrar gestión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

function formatDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString(
    'es-BO',
  );
}