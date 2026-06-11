import { useEffect, useState } from 'react';
import {
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  PowerIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import CalleModal from '../components/CalleModal';
import { CallesServices } from '../services/calles.services';

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
      return;
    }

    const data =
      response.data ||
      response.calles ||
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

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-sky-50 p-3 text-sky-800">
            <BuildingOffice2Icon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Calles
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Administra las calles registradas en la OTB.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-900"
        >
          <PlusIcon className="h-5 w-5" />
          Nueva calle
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
              placeholder="Buscar calle..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-sky-700 focus:ring-4 focus:ring-sky-100"
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
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-700 focus:ring-4 focus:ring-sky-100"
          >
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
            Cargando calles...
          </div>
        ) : calles.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
            No hay calles registradas
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Nombre calle</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {calles.map((calle) => (
                  <tr
                    key={calle.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-600">
                      {calle.id}
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {calle.nombre_calle}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          calle.estado
                            ? 'bg-green-100 text-green-700'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {calle.estado ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(calle)}
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                          title="Editar"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(calle)}
                          className={`rounded-xl border p-2 transition ${
                            calle.estado
                              ? 'border-red-200 text-sky-700 hover:bg-sky-50'
                              : 'border-green-200 text-green-700 hover:bg-green-50'
                          }`}
                          title={
                            calle.estado
                              ? 'Deshabilitar'
                              : 'Habilitar'
                          }
                        >
                          <PowerIcon className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(calle)}
                          className="rounded-xl border border-red-200 p-2 text-sky-700 transition hover:bg-sky-50"
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
                : calles.length < limit
            }
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-50"
          >
            Siguiente
          </button>
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