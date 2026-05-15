import { useMemo, useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../../components/DataTable';
import SocioModal from './SocioModal';
import { SocioServices as Servs } from '../../services/socio.services';
import Select from '../../../../components/Select';
import ConfirmModal from '../../../../components/ConfirmModal';
import { MODALS, useModalManager } from '../../../../hooks/useModalManager';

const opcionesEstadoSocio = [
  { value: 'HABILITADO', label: 'Habilitado' },
  { value: 'DESHABILITADO', label: 'Deshabilitado' },
];

export default function SocioPage() {
  const [filas, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [selectEstadoSocio, setSelectEstadoSocio] = useState('');
  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  const [loadingDelete, setLoadingDelete] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'ci_socio',
        header: 'CI',
        cell: (info) => info.row.original.ci_socio,
      },
      {
        accessorKey: 'ci_expedido_socio',
        header: 'Expedido',
        cell: (info) => info.row.original.ci_expedido_socio,
      },
      {
        accessorKey: 'nombre_completo',
        header: 'Nombre completo',
        cell: (info) => {
          const socio = info.row.original;
          return `${socio.nombres_socio} ${socio.primer_apellido_socio} ${socio.segundo_apellido_socio}`;
        },
      },

      {
        accessorKey: 'numero_celular_socio',
        header: 'Celular',
        cell: (info) => info.row.original.numero_celular_socio,
      },

      {
        accessorKey: 'numero_telefono_socio',
        header: 'Teléfono',
        cell: (info) => info.row.original.numero_telefono_socio,
      },

      {
        accessorKey: 'genero_socio',
        header: 'Género',
        cell: (info) => info.row.original.genero_socio,
      },

      {
        accessorKey: 'estado_socio',
        header: 'Estado',
        cell: (info) => info.row.original.estado_socio,
      },

      {
        accessorKey: 'direccion_socio',
        header: 'Dirección',
        cell: (info) => (
          <div className="max-w-60 whitespace-normal warp-break-words">
            {info.row.original.direccion_socio}
          </div>
        ),
      },

      {
        id: 'acciones',
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            {/* EDITAR */}
            <button
              type="button"
              className="rounded-xl bg-sky-800 px-3 py-2 text-white hover:bg-sky-900"
              onClick={() => {
                openModal(MODALS.EDIT, row.original);
              }}
            >
              Editar
            </button>

            <button
              className={`rounded-xl borde px-3 py-2 text-black ${
                row.original.estado_socio === 'HABILITADO'
                  ? 'bg-yellow-400 hover:bg-yellow-500'
                  : 'bg-sky-800 hover:bg-sky-900 text-white'
              }`}
              onClick={() => {
                handleToggleStatus(row.original.id);
              }}
            >
              {row.original.estado_socio === 'HABILITADO'
                ? 'DESHABILITAR'
                : 'HABILITAR'}
            </button>

            <button
              className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900"
              onClick={() => {
                openModal(MODALS.DELETE, row.original.id);
              }}
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
        selectEstadoSocio,
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
  }, [pagination.page, pagination.limit, searchInput, selectEstadoSocio]);

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      const response = await Servs.delete(modalState?.data);
      if (!response.ok) {
        toast.error(response.message || 'Error al eliminar');
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

  const handleToggleStatus = async (id) => {
    try {
      setLoadingDelete(true);
      const response = await Servs.toggleStatus(id);
      if (!response.ok) {
        toast.error(response.message || 'Error al actualizar el estado');
        return;
      }
      toast.success(response.message || 'Socio actualizado correctamente');
      setSelectEstadoSocio('');
      fetchFilas();
    } catch (error) {
      toast.error(error.message || 'Error inesperado');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Socios</h2>
        <button
          className="rounded-xl bg-sky-800 px-10 py-2 text-white hover:bg-sky-900"
          onClick={() => {
            openModal(MODALS.CREATE);
          }}
        >
          Nuevo registro
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="relative z-50 rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm">
        <div className="block lg:flex justify-between">
          <div className="w-full md:max-w-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Buscar
            </label>

            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-900"
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

          <div className="relative z-50 w-full md:max-w-sm">
            <Select
              label="Seleccione estado "
              placeholder="Seleccione un valor"
              value={selectEstadoSocio}
              options={opcionesEstadoSocio}
              onChange={(e) => {
                setSelectEstadoSocio(e.target.value);
              }}
            />
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

      <SocioModal
        open={isModalOpen(MODALS.CREATE)}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          fetchFilas();
        }}
      />

      <SocioModal
        open={isModalOpen(MODALS.EDIT)}
        isEdit={true}
        socio={modalState?.data}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          fetchFilas();
        }}
      />
      <ConfirmModal
        open={isModalOpen(MODALS.DELETE)}
        title="¿Esta seguro que desea eliminar el socio?"
        message="¿Deseas continuar?"
        confirmText="Si, eliminar"
        cancelText="Cancelar"
        loading={loadingDelete}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
    </>
  );
}
