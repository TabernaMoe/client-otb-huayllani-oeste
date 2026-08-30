import { useMemo, useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import DataTable from '../../../../components/DataTable';
import { HistorialCobrosServices as Servs } from '../../HistorialCobros.services';

import { MODALS, useModalManager } from '../../../../hooks/useModalManager';
import HistorialByAccionModal from './HistorialByAccionModal';

export default function HistorialCobrosPorAccion() {
  const [filas, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { modalState, openModal, closeModal, isModalOpen } = useModalManager();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'codigo_interno',
        header: 'CODIGO',
      },
      {
        accessorKey: 'nro_medidor',
        header: 'NRO MEDIDOR',
      },

      {
        accessorKey: 'nombre_completo',
        header: 'nombre_completo',
      },

      {
        accessorKey: 'nombre_calle',
        header: 'NOMBRE CALLE',
      },
      {
        accessorKey: 'estado',
        header: 'ESTADO',
      },
      {
        id: 'acciones',
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="rounded-xl bg-slate-200 px-1 py-2 text-black hover:bg-slate-300 border border-slate-500"
              onClick={() => {
                openModal(MODALS.VIEW, row.original.id);
              }}
            >
              VER DETALLES
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const fetchFilas = async () => {
    try {
      setLoading(true);
      const response = await Servs.getHitorialPorAccion(
        pagination.page,
        pagination.limit,
        searchInput,
      );
      if (response.ok) {
        setFila(response?.data || []);
        setPagination((prev) => ({
          ...prev,
          page: response?.page || prev.page,
          totalItems: response?.total || 0,
          totalPages: response?.totalPages || 1,
        }));
      }

      if (!response.ok) {
        toast.error(response.message || 'Error al cargar datos');
      }
    } catch (error) {
      toast.error(error.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFilas();
  }, [pagination.page, pagination.limit, searchInput]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          HISTORIAL DE COBROS POR ACCION
        </h2>
      </div>
      {/* BUSCADOR */}
      <div className="rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm">
        <div className="w-full md:max-w-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Buscar
          </label>

          <div className="relative">
            <MagnifyingGlassIcon
              className="
                pointer-events-none
                absolute left-3 top-1/2
                h-5 w-5
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Buscar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="
                w-full rounded-2xl
                border border-slate-300
                bg-white
                py-2 pl-10 pr-10
                text-sm text-slate-900
              "
            />

            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="
                  absolute right-2 top-1/2
                  -translate-y-1/2
                  rounded-full
                  p-1
                "
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <DataTable
        data={filas}
        columns={columns}
        loading={loading}
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={(newPage) =>
          setPagination((prev) => ({
            ...prev,
            page: newPage,
          }))
        }
        limit={pagination.limit}
        onLimitChange={(newLimit) =>
          setPagination((prev) => ({
            ...prev,
            page: 1,
            limit: Number(newLimit),
          }))
        }
      />

      <HistorialByAccionModal
        id={modalState.data}
        open={isModalOpen(MODALS.VIEW)}
        onClose={closeModal}
      />
    </>
  );
}
