import { useMemo, useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../../components/DataTable';
import AccionesModal from './AccionesModal';
import { AccionServices as Servs } from '../../services/acciones.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import { MODALS, useModalManager } from '../../../../hooks/useModalManager';

export default function AccionesPage() {
  const { modalState, openModal, closeModal, isModalOpen } = useModalManager();
  const [filas, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [loadingDelete, setLoadingDelete] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });
  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      const response = await Servs.delete(modalState.data);
      if (!response.ok) {
        toast.error(response.message || 'Error al eliminar');
        closeModal();
        return;
      }
      toast.success('Socio eliminado correctamente');
      closeModal();
      fetchFilas();
    } catch (error) {
      toast.error(error.message || 'Error inesperado');
    } finally {
      setLoadingDelete(false);
    }
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: 'ci_socio',
        header: 'Cedula de entidad',
        cell: (info) => info.row.original.ci_socio,
      },
      {
        accessorKey: 'primer_apellido_socio',
        header: 'Primer apellido',
        cell: (info) => info.row.original.primer_apellido_socio,
      },
      {
        accessorKey: 'segundo_apellido_socio',
        header: 'Segundo apellido',
        cell: (info) => info.row.original.segundo_apellido_socio,
      },
      {
        accessorKey: 'codigo_interno_accion',
        header: 'Codigo interno',
        cell: (info) => info.row.original.codigo_interno_accion,
      },
      {
        accessorKey: 'nro_medidor_accion',
        header: 'Nro medidor',
        cell: (info) => info.row.original.nro_medidor_accion,
      },
      {
        accessorKey: 'direccion_acciones',
        header: 'Direccion',
        cell: (info) => info.row.original.direccion_acciones,
      },
      {
        accessorKey: 'observaciones_acciones',
        header: 'Observaciones',
        cell: (info) => info.row.original.observaciones_acciones,
      },
      {
        accessorKey: 'estado_accion',
        header: 'Estado de la accion',
        cell: (info) => info.row.original.estado_accion,
      },

      {
        accessorKey: 'nombre_calle',
        header: 'Nombre calle',
        cell: (info) => info.row.original.nombre_calle,
      },

      {
        id: 'acciones',
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
              onClick={() => openModal(MODALS.EDIT, row.original)}
            >
              Editar
            </button>

            <button
              className="rounded-xl bg-red-700 px-3 py-2 text-white hover:bg-red-800"
              onClick={() => openModal(MODALS.DELETE, row.original.id)}
            >
              Eliminar
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
      const response = await Servs.getAll(
        pagination.page,
        pagination.limit,
        searchInput,
      );
      if (response.ok) {
        setFila(response?.data || []);
        setPagination((prev) => ({
          ...prev,
          page: response?.pagination?.page || prev.page,
          totalItems: response?.pagination?.totalItems || 0,
          totalPages: response?.pagination?.totalPages || 1,
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
        <h2 className="text-xl font-semibold">Gestion de acciones</h2>

        <button
          className="
            rounded-xl
            bg-sky-700
            px-10 py-2
            text-white
            hover:bg-sky-900
          "
          onClick={() => {
            openModal(MODALS.CREATE);
          }}
        >
          Nuevo registro
        </button>
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

      {/* TABLA */}
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

      <AccionesModal
        open={isModalOpen(MODALS.CREATE)}
        onClose={closeModal}
        onSuccess={() => {
          closeModal(false);
          fetchFilas();
        }}
      />
      <AccionesModal
        open={isModalOpen(MODALS.EDIT)}
        tipoAccion={modalState.data}
        isEdit={true}
        onClose={closeModal}
        onSuccess={() => {
          closeModal(false);
          fetchFilas();
        }}
      />
      <ConfirmModal
        open={isModalOpen(MODALS.DELETE)}
        title="Eliminar registro"
        message="Esta acción no se puede deshacer. ¿Deseas continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={loadingDelete}
        danger
        onClose={closeModal}
        onConfirm={handleDelete}
      />
    </>
  );
}
