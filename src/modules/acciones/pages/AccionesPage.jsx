import { useEffect, useState } from 'react';
import {
  PlusIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

import { AccionesServices } from '../services/acciones.services';
import AccionModal from '../components/AccionModal';

const getSocioName = (accion) =>
  accion?.socio?.nombre_completo ||
  accion?.socio?.nombres ||
  accion?.nombre_completo ||
  accion?.nombre_socio ||
  accion?.socio_nombre ||
  '-';

export default function AccionesPage() {
  const [acciones, setAcciones] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('ACTIVO');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAcciones = async () => {
    setLoading(true);
    setMessage('');

    const res = await AccionesServices.getAll(page, limit, search, estado);

    setLoading(false);

    if (!res.ok) {
      setMessage(res.message || 'Error al cargar acciones');
      setAcciones([]);
      return;
    }

    setAcciones(res.data || []);
    setTotalPages(res.totalPages || res.pagination?.totalPages || 1);
  };

  useEffect(() => {
    fetchAcciones();
  }, [page, search, estado]);

  const openCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const openEdit = async (accion) => {
    const res = await AccionesServices.getById(accion.id);

    if (!res.ok) {
      setMessage(res.message || 'Error al obtener acción');
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

  const handleSearchChange = (e) => {
    setPage(1);
    setSearch(e.target.value);
  };

  const handleEstadoChange = (e) => {
    setPage(1);
    setEstado(e.target.value);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-800">
            <CreditCardIcon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">Acciones</h1>
            <p className="mt-1 text-sm text-slate-500">
              Gestiona las acciones registradas de los socios.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-900"
        >
          <PlusIcon className="h-5 w-5" />
          Nueva acción
        </button>
      </div>

      {message && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
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
              onChange={handleSearchChange}
              placeholder="Buscar socio, medidor o dirección..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select
            value={estado}
            onChange={handleEstadoChange}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="ACTIVO">ACTIVO</option>
            <option value="PASIVO">PASIVO</option>
            <option value="ANULADO">ANULADO</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Socio</th>
                <th className="px-4 py-3 font-semibold">Medidor</th>
                <th className="px-4 py-3 font-semibold">Dirección</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    Cargando acciones...
                  </td>
                </tr>
              ) : acciones.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No hay acciones registradas
                  </td>
                </tr>
              ) : (
                acciones.map((accion) => (
                  <tr
                    key={accion.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">{accion.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {getSocioName(accion)}
                    </td>
                    <td className="px-4 py-3">{accion.nro_medidor || '-'}</td>
                    <td className="px-4 py-3">{accion.direccion || '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          accion.estado === 'ACTIVO'
                            ? 'bg-green-100 text-green-700'
                            : accion.estado === 'PASIVO'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {accion.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(accion)}
                          className="rounded-xl border border-slate-200 p-2 text-blue-700 hover:bg-blue-50"
                          title="Editar"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
            className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="font-medium text-slate-500">
            Página {page} de {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
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