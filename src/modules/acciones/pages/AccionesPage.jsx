import { useEffect, useMemo, useState } from 'react';
import {
  PlusIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
  MapPinIcon,
  SignalIcon,
  UsersIcon,
  CheckCircleIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';

import { AccionesServices } from '../services/acciones.services';
import AccionModal from '../components/AccionModal';

const getSocioName = (accion) =>
  accion?.socio?.nombre_completo ||
  [
    accion?.socio?.nombres,
    accion?.socio?.primer_apellido,
    accion?.socio?.segundo_apellido,
  ]
    .filter(Boolean)
    .join(' ') ||
  accion?.nombre_completo ||
  accion?.nombre_socio ||
  accion?.socio_nombre ||
  'Socio sin nombre';

const getSocioInitials = (accion) => {
  const nombre = getSocioName(accion);

  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join('');
};

const getSocioCode = (accion) =>
  accion?.socio?.codigo_socio ||
  accion?.codigo_socio ||
  accion?.socio_codigo ||
  `SOC-${String(accion?.socio_id || accion?.id || '').padStart(4, '0')}`;

const getCalleName = (accion) =>
  accion?.calle?.nombre_calle ||
  accion?.calle?.nombre ||
  accion?.nombre_calle ||
  '-';

const getTarifaName = (accion) =>
  accion?.tarifa?.nombre_tarifa ||
  accion?.tarifa?.nombre ||
  accion?.nombre_tarifa ||
  '-';

const estadoStyles = {
  ACTIVO: {
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  PASIVO: {
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  ANULADO: {
    badge: 'border-red-200 bg-red-50 text-red-700',
    dot: 'bg-red-500',
  },
};

export default function AccionesPage() {
  const [acciones, setAcciones] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('ACTIVO');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAcciones = async () => {
    setLoading(true);
    setMessage('');

    const res = await AccionesServices.getAll(
      page,
      limit,
      search,
      estado,
    );

    setLoading(false);

    if (!res.ok) {
      setMessage(res.message || 'Error al cargar las acciones');
      setAcciones([]);
      setTotalPages(1);
      setTotalItems(0);
      return;
    }

    const responseData = Array.isArray(res.data)
      ? res.data
      : res.data?.data || res.data?.rows || [];

    const pagination = res.pagination || res.data?.pagination || {};

    setAcciones(responseData);
    setTotalPages(
      Number(
        res.totalPages ||
          pagination.totalPages ||
          pagination.total_pages ||
          1,
      ),
    );

    setTotalItems(
      Number(
        res.total ||
          res.totalItems ||
          pagination.total ||
          pagination.totalItems ||
          pagination.total_items ||
          responseData.length,
      ),
    );
  };

  useEffect(() => {
    fetchAcciones();
  }, [page, search, estado]);

  const resumen = useMemo(() => {
    const activos = acciones.filter(
      (accion) => accion.estado === 'ACTIVO',
    ).length;

    const pasivos = acciones.filter(
      (accion) => accion.estado === 'PASIVO',
    ).length;

    const anulados = acciones.filter(
      (accion) => accion.estado === 'ANULADO',
    ).length;

    return {
      visibles: acciones.length,
      activos,
      pasivos,
      anulados,
    };
  }, [acciones]);

  const openCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const openEdit = async (accion) => {
    setMessage('');

    const res = await AccionesServices.getById(accion.id);

    if (!res.ok) {
      setMessage(res.message || 'Error al obtener la acción');
      return;
    }

    setSelected(res.data);
    setModalOpen(true);
  };

  const handleSaved = () => {
    setModalOpen(false);
    setSelected(null);
    fetchAcciones();
  };

  const handleSearchChange = (event) => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleEstadoChange = (event) => {
    setPage(1);
    setEstado(event.target.value);
  };

  const clearFilters = () => {
    setPage(1);
    setSearch('');
    setEstado('ACTIVO');
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-16">
            <div className="flex flex-col items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
              <p className="mt-3 text-sm font-medium text-slate-500">
                Cargando acciones...
              </p>
            </div>
          </td>
        </tr>
      );
    }

    if (acciones.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                <CreditCardIcon className="h-8 w-8" />
              </div>

              <h3 className="mt-4 font-bold text-slate-700">
                No se encontraron acciones
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                No existen registros con los filtros seleccionados.
              </p>
            </div>
          </td>
        </tr>
      );
    }

    return acciones.map((accion) => {
      const styles = estadoStyles[accion.estado] || estadoStyles.ANULADO;

      return (
        <tr key={accion.id} className="transition hover:bg-slate-50/80">
          <td className="px-6 py-4">
            <div className="flex min-w-60 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                {getSocioInitials(accion) || 'S'}
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  {getSocioName(accion)}
                </p>

                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <IdentificationIcon className="h-3.5 w-3.5" />
                  {getSocioCode(accion)}
                </div>
              </div>
            </div>
          </td>

          <td className="px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <SignalIcon className="h-4 w-4" />
              </span>

              <span className="font-semibold text-slate-700">
                {accion.nro_medidor || '-'}
              </span>
            </div>
          </td>

          <td className="px-4 py-4 text-slate-600">
            {getCalleName(accion)}
          </td>

          <td className="px-4 py-4">
            <div className="flex max-w-56 items-start gap-2 text-slate-600">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>{accion.direccion || '-'}</span>
            </div>
          </td>

          <td className="px-4 py-4 text-slate-600">
            {getTarifaName(accion)}
          </td>

          <td className="px-4 py-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${styles.badge}`}
            >
              <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
              {accion.estado}
            </span>
          </td>

          <td className="px-6 py-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => openEdit(accion)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                title="Editar acción"
              >
                <PencilSquareIcon className="h-4 w-4" />
                Editar
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">
        {/* Encabezado */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Inicio</span>
              <span>/</span>
              <span>Socios</span>
              <span>/</span>
              <span className="text-emerald-700">
                Gestión de acciones
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de acciones
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra las conexiones, medidores y datos asociados a
              cada socio.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva acción
          </button>
        </div>

        {/* Tarjetas resumen */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total de acciones
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {totalItems}
                </p>
              </div>

              <div className="rounded-full bg-slate-100 p-3 text-slate-700">
                <CreditCardIcon className="h-6 w-6" />
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Activas en esta página
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-700">
                  {resumen.activos}
                </p>
              </div>

              <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Registros visibles
                </p>
                <p className="mt-2 text-2xl font-bold text-blue-800">
                  {resumen.visibles}
                </p>
              </div>

              <div className="rounded-full bg-blue-50 p-3 text-blue-800">
                <UsersIcon className="h-6 w-6" />
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Estado seleccionado
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {estado}
                </p>
              </div>

              <div className="rounded-full bg-amber-50 p-3 text-amber-700">
                <FunnelIcon className="h-6 w-6" />
              </div>
            </div>
          </article>
        </div>

        {message && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {message}
          </div>
        )}

        {/* Contenedor principal */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Título y filtros */}
          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                    1
                  </span>

                  <h2 className="text-base font-bold text-slate-900">
                    Acciones registradas
                  </h2>
                </div>

                <p className="ml-10 mt-1 text-sm text-slate-500">
                  Busque una acción por socio, número de medidor o
                  dirección.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative w-full sm:w-80">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Buscar socio, medidor o dirección"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                  />
                </div>

                <select
                  value={estado}
                  onChange={handleEstadoChange}
                  className="min-w-40 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                >
                  <option value="ACTIVO">Activas</option>
                  <option value="PASIVO">Pasivas</option>
                  <option value="ANULADO">Anuladas</option>
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

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="min-w-262.5 w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Socio</th>
                  <th className="px-4 py-4">Medidor</th>
                  <th className="px-4 py-4">Calle</th>
                  <th className="px-4 py-4">Dirección</th>
                  <th className="px-4 py-4">Tarifa</th>
                  <th className="px-4 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {renderTableBody()}
              </tbody>
            </table>
          </div>

          {/* Pie y paginación */}
          <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <p className="text-sm text-slate-500">
              Mostrando{' '}
              <span className="font-semibold text-slate-700">
                {acciones.length}
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
                disabled={page >= totalPages || loading}
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

      <AccionModal
        open={modalOpen}
        selected={selected}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onSaved={handleSaved}
      />
    </section>
  );
}