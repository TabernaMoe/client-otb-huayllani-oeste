import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import DataTable from '../../../components/DataTable';
import { MODALS, useModalManager } from '../../../hooks/useModalManager';
import AccionAlcantarilladoModal from '../components/AccionAlcantarilladoModal';
import { AlcantarilladoServices as Servs } from '../services/accionesAlcantarillado.services';

export default function AccionesAlcantarilladoPage() {
  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  const cargarAcciones = useCallback(async () => {
    setLoading(true);

    const respuesta = await Servs.getAll({
      page: pagination.page,
      limit: pagination.limit,
      search,
    });

    if (respuesta.ok) {
      setFilas(respuesta.data || []);
      setPagination((prev) => ({
        ...prev,
        page: respuesta.page || prev.page,
        limit: respuesta.limit || prev.limit,
        totalItems: respuesta.total || 0,
        totalPages: respuesta.totalPages || 1,
      }));
    }

    setLoading(false);
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    cargarAcciones();
  }, [cargarAcciones]);

  const handleBuscar = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearch(searchInput.trim());
  };

  const handleSaved = async () => {
    if (pagination.page === 1) {
      await cargarAcciones();
      return;
    }

    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'codigo_interno',
        header: 'Código',
        cell: ({ row }) => (
          <p className="font-semibold text-slate-800">
            {row.original.codigo_interno}
          </p>
        ),
      },
      {
        accessorKey: 'ci_socio',
        header: 'Cédula de identidad',
        cell: ({ row }) => (
          <p className="font-medium text-slate-800">{row.original.ci_socio}</p>
        ),
      },
      {
        accessorKey: 'nombre_completo_socio',
        header: 'Socio',
        cell: ({ row }) => (
          <p className="font-medium text-slate-800">
            {row.original.nombre_completo_socio}
          </p>
        ),
      },
      { accessorKey: 'nombre_calle', header: 'Calle' },
      { accessorKey: 'direccion', header: 'Dirección' },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => openModal(MODALS.EDIT, row.original.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Editar
          </button>
        ),
      },
    ],
    [openModal],
  );

  return (
    <>
      <section className="space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Alcantarillado
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Acciones de alcantarillado
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Consulta, registra y edita las acciones de alcantarillado.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openModal(MODALS.CREATE)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva acción
          </button>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar acción
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) =>
                    event.key === 'Enter' && handleBuscar()
                  }
                  placeholder="Socio, CI, código o dirección..."
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleBuscar}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={cargarAcciones}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <ArrowPathIcon
                  className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        <DataTable
          data={filas}
          columns={columns}
          loading={loading}
          page={pagination.page}
          limit={pagination.limit}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onLimitChange={(limit) =>
            setPagination((prev) => ({ ...prev, page: 1, limit }))
          }
        />
      </section>

      <AccionAlcantarilladoModal
        onClose={closeModal}
        onCreated={handleSaved}
        open={isModalOpen(MODALS.CREATE)}
      />
      <AccionAlcantarilladoModal
        onClose={closeModal}
        onCreated={handleSaved}
        open={isModalOpen(MODALS.EDIT)}
        id={modalState.data}
      />
    </>
  );
}
