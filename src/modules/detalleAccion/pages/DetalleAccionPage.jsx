import { useEffect, useState } from 'react';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  PowerIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import DetalleAccionModal from '../components/DetalleAccionModal';
import { DetalleAccionServices } from '../services/detalleAccion.services';

export default function DetalleAccionPage() {
  const [detalles, setDetalles] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState(true);

  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetalle, setSelectedDetalle] = useState(null);
  const [message, setMessage] = useState('');

  const fetchDetalles = async () => {
    setLoading(true);
    setMessage('');

    const response = await DetalleAccionServices.getAll(
      page,
      limit,
      search,
      estado,
    );

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar detalles');
      return;
    }

    const data =
      response.data ||
      response.detalles ||
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

    setDetalles(data);
    setPagination(paginationData);
  };

  useEffect(() => {
    fetchDetalles();
  }, [page, search, estado]);

  const openCreateModal = () => {
    setSelectedDetalle(null);
    setModalOpen(true);
  };

  const openEditModal = async (detalle) => {
    setMessage('');

    const response = await DetalleAccionServices.getById(detalle.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar el detalle');
      return;
    }

    const data = response.data || response.dato || detalle;

    setSelectedDetalle(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDetalle(null);
  };

  const handleSuccess = () => {
    setMessage(
      selectedDetalle
        ? 'Detalle actualizado correctamente'
        : 'Detalle creado correctamente',
    );

    closeModal();
    fetchDetalles();
  };

  const handleDelete = async (detalle) => {
    const nombre =
      detalle.nombre_accion ||
      detalle.nombre_detalle_accion ||
      'este detalle';

    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar "${nombre}"?`,
    );

    if (!confirmDelete) return;

    const response = await DetalleAccionServices.delete(detalle.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al eliminar detalle');
      return;
    }

    setMessage('Detalle eliminado correctamente');
    fetchDetalles();
  };

  const handleToggleStatus = async (detalle) => {
    const nombre =
      detalle.nombre_accion ||
      detalle.nombre_detalle_accion ||
      'este detalle';

    const accion = detalle.estado ? 'deshabilitar' : 'habilitar';

    const confirmToggle = window.confirm(
      `¿Seguro que deseas ${accion} "${nombre}"?`,
    );

    if (!confirmToggle) return;

    const response = await DetalleAccionServices.toggleStatus(detalle.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al cambiar estado');
      return;
    }

    setMessage('Estado actualizado correctamente');
    fetchDetalles();
  };

  const getNombre = (detalle) =>
    detalle.nombre_accion ||
    detalle.nombre_detalle_accion ||
    'Sin nombre';

  const getPrecio = (detalle) =>
    detalle.precio_accion ??
    detalle.costo_detalles_accion ??
    0;

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-red-50 p-3 text-red-800">
            <ClipboardDocumentListIcon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Detalle pago acción
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Administra los conceptos y costos relacionados a las acciones.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-900"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo detalle
        </button>
      </div>

      {message && (
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          {message}
        </div>
      )}

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Buscar detalle..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
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
            onChange={(e) => {
              setPage(1);
              setEstado(e.target.value === 'true');
            }}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
          >
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
            Cargando detalles...
          </div>
        ) : detalles.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
            No hay detalles registrados
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Detalle</th>
                  <th className="px-4 py-3 font-semibold">Precio</th>
                  <th className="px-4 py-3 font-semibold">Tipo cobro</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {detalles.map((detalle) => (
                  <tr
                    key={detalle.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-600">
                      {detalle.id}
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {getNombre(detalle)}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      Bs. {getPrecio(detalle)}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {detalle.tipo_cobro || 'Sin tipo'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          detalle.estado
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {detalle.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(detalle)}
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                          title="Editar"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(detalle)}
                          className={`rounded-xl border p-2 transition ${
                            detalle.estado
                              ? 'border-red-200 text-red-700 hover:bg-red-50'
                              : 'border-green-200 text-green-700 hover:bg-green-50'
                          }`}
                          title={
                            detalle.estado
                              ? 'Deshabilitar'
                              : 'Habilitar'
                          }
                        >
                          <PowerIcon className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(detalle)}
                          className="rounded-xl border border-red-200 p-2 text-red-700 transition hover:bg-red-50"
                          title="Eliminar"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="text-slate-500">
            Página {page}
            {pagination?.totalPages ? ` de ${pagination.totalPages}` : ''}
          </span>

          <button
            type="button"
            disabled={
              pagination?.totalPages
                ? page >= pagination.totalPages
                : detalles.length < limit
            }
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      <DetalleAccionModal
        open={modalOpen}
        detalle={selectedDetalle}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </section>
  );
}