import { useEffect, useMemo, useState } from 'react';
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
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import TarifaModal from '../components/TarifaModal';
import { TarifasServices } from '../services/tarifas.services';

export default function TarifasPage() {
  const [tarifas, setTarifas] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState(true);

  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTarifa, setSelectedTarifa] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const fetchTarifas = async () => {
    setLoading(true);
    setMessage('');

    const response = await TarifasServices.getAll(
      page,
      limit,
      search,
      estado,
    );

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar tarifas');
      setMessageType('error');
      setTarifas([]);
      return;
    }

    const data =
      response.data ||
      response.tarifas ||
      response.items ||
      [];

    const paginationData =
      response.pagination ||
      response.meta ||
      {
        totalPages: response.totalPages,
        totalItems: response.total,
        page: response.page,
      };

    setTarifas(data);
    setPagination(paginationData);
  };

  useEffect(() => {
    fetchTarifas();
  }, [page, search, estado]);

  const openCreateModal = () => {
    setSelectedTarifa(null);
    setModalOpen(true);
  };

  const openEditModal = async (tarifa) => {
    setMessage('');

    const response = await TarifasServices.getById(tarifa.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar tarifa');
      setMessageType('error');
      return;
    }

    const data = response.data || response.dato || tarifa;

    setSelectedTarifa(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTarifa(null);
  };

  const handleSuccess = () => {
    setMessage(
      selectedTarifa
        ? 'Tarifa actualizada correctamente'
        : 'Tarifa creada correctamente',
    );
    setMessageType('success');

    closeModal();
    fetchTarifas();
  };

  const handleDelete = async (tarifa) => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar la tarifa "${tarifa.nombre_tarifa}"?`,
    );

    if (!confirmDelete) return;

    const response = await TarifasServices.delete(tarifa.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al eliminar tarifa');
      setMessageType('error');
      return;
    }

    setMessage('Tarifa eliminada correctamente');
    setMessageType('success');
    fetchTarifas();
  };

  const handleToggleStatus = async (tarifa) => {
    const accion = tarifa.estado ? 'deshabilitar' : 'habilitar';

    const confirmToggle = window.confirm(
      `¿Seguro que deseas ${accion} la tarifa "${tarifa.nombre_tarifa}"?`,
    );

    if (!confirmToggle) return;

    const response = await TarifasServices.toggleStatus(tarifa.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al cambiar estado');
      setMessageType('error');
      return;
    }

    setMessage('Estado actualizado correctamente');
    setMessageType('success');
    fetchTarifas();
  };

  const getRangos = (tarifa) =>
    tarifa.rangosTarifa ||
    tarifa.rangos_tarifa ||
    tarifa.rangos ||
    tarifa.tarifa_rangos ||
    [];

  const resumen = useMemo(() => {
    const totalRangos = tarifas.reduce(
      (sum, tarifa) => sum + getRangos(tarifa).length,
      0,
    );

    return {
      visibles: tarifas.length,
      totalRangos,
      activas: estado ? tarifas.length : 0,
      inactivas: !estado ? tarifas.length : 0,
    };
  }, [tarifas, estado]);

  const totalPages = Number(pagination?.totalPages || 1);

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
              <span className="text-emerald-700">Tarifas</span>
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
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva tarifa
          </button>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Tarifas visibles"
            value={resumen.visibles}
            icon={CurrencyDollarIcon}
          />
          <MetricCard
            label="Rangos configurados"
            value={resumen.totalRangos}
            icon={ChartBarIcon}
          />
          <MetricCard
            label="Tarifas activas"
            value={resumen.activas}
            icon={CheckCircleIcon}
          />
          <MetricCard
            label="Tarifas inactivas"
            value={resumen.inactivas}
            icon={PowerIcon}
          />
        </div>

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-medium ${
              messageType === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                  1
                </span>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Tarifas registradas
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Consulta, edita y administra el estado de las tarifas.
                  </p>
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
                    placeholder="Buscar tarifa"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-11 pr-11 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
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
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                >
                  <option value="true">Activas</option>
                  <option value="false">Inactivas</option>
                </select>

                <button
                  type="button"
                  onClick={fetchTarifas}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ArrowPathIcon
                    className={`h-4 w-4 ${
                      loading ? 'animate-spin' : ''
                    }`}
                  />
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-237.5 w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Tarifa</th>
                  <th className="px-4 py-4">Código</th>
                  <th className="px-4 py-4">Rangos</th>
                  <th className="px-4 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {(() => {
                  if (loading) {
                    return [
                      (
                        <tr key="loading">
                          <td colSpan="5" className="px-6 py-16">
                            <div className="flex flex-col items-center justify-center">
                              <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
                              <p className="mt-3 text-sm font-medium text-slate-500">
                                Cargando tarifas...
                              </p>
                            </div>
                          </td>
                        </tr>
                      ),
                    ];
                  }

                  if (tarifas.length === 0) {
                    return [
                      (
                        <tr key="empty">
                          <td colSpan="5" className="px-6 py-16">
                            <div className="flex flex-col items-center justify-center text-center">
                              <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                                <CurrencyDollarIcon className="h-8 w-8" />
                              </div>
                              <h3 className="mt-4 font-bold text-slate-700">
                                No hay tarifas registradas
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">
                                Crea una tarifa para comenzar.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ),
                    ];
                  }

                  return tarifas.map((tarifa) => {
                    const rangos = getRangos(tarifa);

                    return (
                      <tr
                        key={tarifa.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-4">
                          <div className="flex min-w-56 items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                              <BanknotesIcon className="h-5 w-5" />
                            </div>

                            <div>
                              <p className="font-bold text-slate-900">
                                {tarifa.nombre_tarifa}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                Tarifa de consumo de agua
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-600">
                          #{String(tarifa.id).padStart(4, '0')}
                        </td>

                        <td className="px-4 py-4">
                          {rangos.length > 0 ? (
                            <div className="flex max-w-xl flex-wrap gap-2">
                              {rangos.slice(0, 3).map((rango, index) => (
                                <span
                                  key={rango.id || index}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                                >
                                  <ScaleIcon className="h-3.5 w-3.5" />
                                  {rango.consumo_minimo ??
                                    rango.rango_min ??
                                    0}
                                  {' - '}
                                  {rango.consumo_maximo ??
                                    rango.rango_max ??
                                    0}
                                  {' · Bs '}
                                  {rango.precio ??
                                    rango.precio_unitario ??
                                    0}
                                </span>
                              ))}

                              {rangos.length > 3 && (
                                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                  +{rangos.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">
                              Sin rangos
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                              tarifa.estado
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-slate-200 bg-slate-100 text-slate-600'
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                tarifa.estado
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {tarifa.estado ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(tarifa)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(tarifa)}
                              className={`rounded-lg border p-2 transition ${
                                tarifa.estado
                                  ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title={
                                tarifa.estado
                                  ? 'Deshabilitar'
                                  : 'Habilitar'
                              }
                            >
                              <PowerIcon className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(tarifa)}
                              className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                              title="Eliminar"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <p className="text-sm text-slate-500">
              Mostrando{' '}
              <span className="font-semibold text-slate-700">
                {tarifas.length}
              </span>{' '}
              tarifas
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((previous) => previous - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
                    : tarifas.length < limit)
                }
                onClick={() => setPage((previous) => previous + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <TarifaModal
        open={modalOpen}
        tarifa={selectedTarifa}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </section>
  );
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}