import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ArrowPathIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PowerIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import DataTable from '../../../components/DataTable';

import { AlcantarilladoServices as Servs } from '../services/accionesAlcantarillado.services';
import { toast } from 'react-toastify';
import AccionAlcantarilladoModal from '../components/AccionAlcantarilladoModal';
import { MODALS, useModalManager } from '../../../hooks/useModalManager';

export default function AccionesAlcantarilladoPage() {
  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
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
      search: searchInput,
    });

    if (respuesta.ok) {
      setFilas(respuesta.data);
      setPagination((prev) => ({
        ...prev,
        page: respuesta.page,
        limit: respuesta.limit,
        totalItems: respuesta.total,
        totalPages: respuesta.totalPages,
      }));
    }

    setLoading(false);
  }, [pagination.page, pagination.limit, searchInput]);

  useEffect(() => {
    cargarAcciones();
  }, [cargarAcciones]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'codigo_interno',
        header: 'Código',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-800">
              {row.original.codigo_interno}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'ci_socio',
        header: 'Cedula indentidad',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-800">
              {row.original.ci_socio}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'nombre_completo_socio',
        header: 'Socio',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-800">
              {row.original.nombre_completo_socio}
            </p>
          </div>
        ),
      },
      { accessorKey: 'nombre_calle', header: 'Calle' },
      { accessorKey: 'direccion', header: 'Direccion' },

      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <button
            onClick={() => {
              openModal(MODALS.EDIT, row.original.id);
            }}
            className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Editar
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <section className="space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Administración
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Acciones registradas
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Consulta y registra las acciones de los socios.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              openModal(MODALS.CREATE);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva acción
          </button>
        </header>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_260px_auto] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar acción
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                  placeholder="Socio, código o medidor..."
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
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
        onCreated={cargarAcciones}
        open={isModalOpen(MODALS.CREATE)}
      />
      <AccionAlcantarilladoModal
        onClose={closeModal}
        onCreated={cargarAcciones}
        open={isModalOpen(MODALS.EDIT)}
        id={modalState.data}
      />
    </>
  );
}
