import { useEffect, useMemo, useState } from 'react';
import {
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { InventarioServices as Servs } from '../inventario.services';
import DataTable from '../../../components/DataTable';
import { MODALS, useModalManager } from '../../../hooks/useModalManager';
import { toast } from 'react-toastify';
import InvetarioModal from './InvetarioModal';

export default function InvetarioPage() {
  const [filas, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  const fetchFilas = async () => {
    try {
      setLoading(true);

      const response = await Servs.getAll(
        pagination.page,
        pagination.limit,
        searchInput,
      );

      if (!response.ok) {
        toast.error(response.message || 'Error al cargar datos');
        return;
      }

      setFila(response?.data || []);

      setPagination((previous) => ({
        ...previous,
        page: response?.page || previous.page,
        totalItems: response?.total || 0,
        totalPages: response?.totalPages || 1,
      }));
    } catch (error) {
      toast.error(error.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilas();
  }, [pagination.page, pagination.limit, searchInput]);

  const handleSumar = async (id) => {
    try {
      const response = await Servs.sumar(id);
      if (!response.ok) {
        throw new Error(response.message || 'No se pudo sumar');
      }
      toast.success(response.message || 'Se incremento correctamente');
      fetchFilas();
    } catch (e) {
      toast.error(e.message || 'No se pudo sumar');
    }
  };
  const handleRestar = async (id) => {
    try {
      const response = await Servs.restar(id);
      if (!response.ok) {
        throw new Error(response.message || 'No se pudo sumar');
      }
      toast.success(response.message || 'Se incremento correctamente');
      fetchFilas();
    } catch (e) {
      toast.error(e.message || 'No se pudo sumar');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_producto',
        header: 'Producto',
      },
      {
        accessorKey: 'saldo_actual',
        header: 'Saldo actual',
      },
      {
        accessorKey: 'salida',
        header: 'Salida',
      },
      {
        id: 'acciones',
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
          return (
            <div className="flex justify-start gap-2">
              {/* ENTRADA */}
              <button
                type="button"
                onClick={() => handleRestar(row.original.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                title="Agregar stock"
              >
                <PlusIcon className="h-4 w-4" />
                Entrada
              </button>

              {/* SALIDA */}
              <button
                type="button"
                onClick={() => handleSumar(row.original.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                title="Registrar salida"
              >
                <MinusIcon className="h-4 w-4" />
                Salida
              </button>

              {/* EDITAR */}
              <button
                type="button"
                onClick={() => openModal(MODALS.EDIT, row.original)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <PencilSquareIcon className="h-4 w-4" />
                Editar
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Inventaio</h2>
          </div>

          <button
            type="button"
            onClick={() => openModal(MODALS.CREATE)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo producto
          </button>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full lg:max-w-md">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar producto
              </label>

              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => {
                    setPagination((previous) => ({
                      ...previous,
                      page: 1,
                    }));
                    setSearchInput(event.target.value);
                  }}
                  placeholder="Nombre, CI o número de celular"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      setPagination((previous) => ({
                        ...previous,
                        page: 1,
                      }));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
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
            setPagination((previous) => ({
              ...previous,
              page: newPage,
            }))
          }
          limit={pagination.limit}
          onLimitChange={(newLimit) =>
            setPagination((previous) => ({
              ...previous,
              page: 1,
              limit: Number(newLimit),
            }))
          }
        />
      </section>
      <InvetarioModal
        open={isModalOpen(MODALS.CREATE)}
        onClose={() => closeModal()}
        onSuccess={() => {
          closeModal();
          fetchFilas();
        }}
      />

      <InvetarioModal
        open={isModalOpen(MODALS.EDIT)}
        isEdit
        dataRow={modalState?.data}
        onClose={() => closeModal()}
        onSuccess={() => {
          closeModal();
          fetchFilas();
        }}
      />
    </>
  );
}
