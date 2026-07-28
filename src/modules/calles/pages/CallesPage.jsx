import { useEffect, useMemo, useState } from 'react';
import {
  ArrowPathIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilSquareIcon,
  PlusIcon,
  PowerIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import CalleModal from '../components/CalleModal';
import { CallesServices } from '../services/calles.services';

const statusStyles = {
  active: {
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  inactive: {
    badge: 'border-slate-200 bg-slate-100 text-slate-600',
    dot: 'bg-slate-400',
  },
};

export default function CallesPage() {
  const [calles, setCalles] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState(true);

  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCalle, setSelectedCalle] = useState(null);
  const [message, setMessage] = useState('');

  const fetchCalles = async () => {
    setLoading(true);
    setMessage('');

    const response = await CallesServices.getAll(
      page,
      limit,
      search,
      estado,
    );

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar calles');
      setCalles([]);
      return;
    }

    const data =
      response.data ||
      response.calles ||
      response.items ||
      [];

    const paginationData =
      response.pagination ||
      response.meta || {
        totalPages: response.totalPages,
        totalItems: response.total,
        page: response.page,
      };

    setCalles(data);
    setPagination(paginationData);
  };

  useEffect(() => {
    fetchCalles();
  }, [page, search, estado]);

  const openCreateModal = () => {
    setSelectedCalle(null);
    setModalOpen(true);
  };

  const openEditModal = (calle) => {
    setSelectedCalle(calle);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCalle(null);
  };

  const handleSuccess = () => {
    setMessage(
      selectedCalle
        ? 'Calle actualizada correctamente'
        : 'Calle creada correctamente',
    );

    closeModal();
    fetchCalles();
  };

  const handleDelete = async (calle) => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar la calle "${calle.nombre_calle}"?`,
    );

    if (!confirmDelete) return;

    const response = await CallesServices.delete(calle.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al eliminar calle');
      return;
    }

    setMessage('Calle eliminada correctamente');
    fetchCalles();
  };

  const handleToggleStatus = async (calle) => {
    const accion = calle.estado ? 'deshabilitar' : 'habilitar';

    const confirmToggle = window.confirm(
      `¿Seguro que deseas ${accion} la calle "${calle.nombre_calle}"?`,
    );

    if (!confirmToggle) return;

    const response = await CallesServices.toggleStatus(calle.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al cambiar estado');
      return;
    }

    setMessage('Estado actualizado correctamente');
    fetchCalles();
  };

  const clearFilters = () => {
    setPage(1);
    setSearch('');
    setEstado(true);
  };

  const totalPages = Number(pagination?.totalPages || 1);
  const totalItems = Number(
    pagination?.totalItems ||
      pagination?.total ||
      calles.length,
  );

  const resumen = useMemo(
    () => ({
      visibles: calles.length,
      activas: calles.filter((calle) => calle.estado).length,
      inactivas: calles.filter((calle) => !calle.estado).length,
    }),
    [calles],
  );

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Inicio</span>
              <span>/</span>
              <span>Configuración</span>
              <span>/</span>
              <span className="text-emerald-700">Calles</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de calles
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra las calles registradas y su disponibilidad dentro de la OTB.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva calle
          </button>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total de calles"
            value={totalItems}
            icon={BuildingOffice2Icon}
            iconClass="bg-slate-100 text-slate-700"
          />

          <MetricCard
            label="Calles activas"
            value={resumen.activas}
            icon={CheckCircleIcon}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            label="Calles inactivas"
            value={resumen.inactivas}
            icon={PowerIcon}
            iconClass="bg-amber-50 text-amber-700"
          />

          <MetricCard
            label="Registros visibles"
            value={resumen.visibles}
            icon={MapPinIcon}
            iconClass="bg-blue-50 text-blue-700"
          />
        </div>

        {message && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            {message}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                    1
                  </span>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Calles registradas
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Busque una calle o filtre por estado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative w-full sm:w-80">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setPage(1);
                      setSearch(event.target.value);
                    }}
                    placeholder="Buscar calle por nombre"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setPage(1);
                        setSearch('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Limpiar búsqueda"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <select
                  value={String(estado)}
                  onChange={(event) => {
                    setPage(1);
                    setEstado(event.target.value === 'true');
                  }}
                  className="min-w-40 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                >
                  <option value="true">Activas</option>
                  <option value="false">Inactivas</option>
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Calle</th>
                  <th className="px-4 py-4">Código</th>
                  <th className="px-4 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Cargando calles...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : calles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                          <MapPinIcon className="h-8 w-8" />
                        </div>

                        <h3 className="mt-4 font-bold text-slate-700">
                          No se encontraron calles
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                          No existen registros con los filtros seleccionados.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  calles.map((calle) => {
                    const styles = calle.estado
                      ? statusStyles.active
                      : statusStyles.inactive;

                    return (
                      <tr
                        key={calle.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-4">
                          <div className="flex min-w-56 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                              <MapPinIcon className="h-5 w-5" />
                            </div>

                            <div>
                              <p className="font-bold text-slate-900">
                                {calle.nombre_calle}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                Calle registrada en la OTB
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-600">
                            #{String(calle.id).padStart(4, '0')}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${styles.badge}`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${styles.dot}`}
                            />
                            {calle.estado ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(calle)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                              title="Editar calle"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(calle)}
                              className={`rounded-lg border p-2 transition ${
                                calle.estado
                                  ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title={
                                calle.estado
                                  ? 'Deshabilitar calle'
                                  : 'Habilitar calle'
                              }
                            >
                              <PowerIcon className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(calle)}
                              className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                              title="Eliminar calle"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <p className="text-sm text-slate-500">
              Mostrando{' '}
              <span className="font-semibold text-slate-700">
                {calles.length}
              </span>{' '}
              registros
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => prev - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página anterior"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-bold text-emerald-700">
                {page}
              </span>

              <span className="px-1 text-sm text-slate-400">
                de {totalPages}
              </span>

              <button
                type="button"
                disabled={
                  loading ||
                  (pagination?.totalPages
                    ? page >= pagination.totalPages
                    : calles.length < limit)
                }
                onClick={() => setPage((prev) => prev + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página siguiente"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CalleModal
        open={modalOpen}
        calle={selectedCalle}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </section>
  );
}

function MetricCard({ label, value, icon: Icon, iconClass }) {
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

        <div className={`rounded-full p-3 ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}