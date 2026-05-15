import { useMemo, useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTableLocal from '../../../../components/DataTableLocal';
import TipoAccionModal from './TipoAccionModal';
import { TipoAccionServices as Servs } from '../../services/tipoAccion.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import { MODALS, useModalManager } from '../../../../hooks/useModalManager';
import { normalize } from '../../../../helpers/funciones';

const datosBusqueda = ['nombre_tipos_acciones'];

export default function TipoAccionPage() {
  const { modalState, openModal, closeModal, isModalOpen } = useModalManager();
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  //eliminar
  const [loadingDelete, setLoadingDelete] = useState(false);

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
        accessorKey: 'nombre_tipos_acciones',
        header: 'Nombre de la accion',
        cell: (info) => info.row.original.nombre_tipos_acciones,
      },
      {
        accessorKey: 'costo_tipos_acciones',
        header: 'Precio de la accion',
        cell: (info) => info.row.original.costo_tipos_acciones,
      },

      {
        id: 'acciones',
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="rounded-xl bg-sky-800 px-3 py-2 text-white hover:bg-sky-900"
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
  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Servs.getAll();
      if (!res.ok) {
        throw new Error(res.data?.message || 'Error al cargar las regiones');
      }
      setFilas(res.data);
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : 'Este es un problema interno, intente nuevamente',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(searchInput);
    if (!q) return filas;
    return filas.filter((r) => {
      const matchSimple = datosBusqueda.some((k) =>
        normalize(r?.[k]).includes(q),
      );
      return matchSimple;
    });
  }, [filas, searchInput, datosBusqueda]);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gestion de calles</h2>

        <button
          className="
            rounded-xl
            bg-sky-800
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

      <DataTableLocal columns={columns} data={filtered} loading={loading} />

      <TipoAccionModal
        open={isModalOpen(MODALS.CREATE)}
        onClose={closeModal}
        onSuccess={() => {
          closeModal(false);
          reload();
        }}
      />
      <TipoAccionModal
        open={isModalOpen(MODALS.EDIT)}
        tipoAccion={modalState.data}
        isEdit={true}
        onClose={closeModal}
        onSuccess={() => {
          closeModal(false);
          reload();
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
