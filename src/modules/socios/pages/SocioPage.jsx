import { useMemo, useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import DataTable from '../../../components/DataTable';
import Select from '../../../components/Select';
import ConfirmModal from '../../../components/ConfirmModal';
import SocioModal from '../components/SocioModal';

import { SocioServices as Servs } from '../services/socio.services';
import { MODALS, useModalManager } from '../../../hooks/useModalManager';

const opcionesEstadoSocio = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
];

export default function SocioPage() {
  const [filas, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [selectEstadoSocio, setSelectEstadoSocio] = useState('');

  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  const getEstadoValue = () => {
    if (selectEstadoSocio === '') return undefined;
    return selectEstadoSocio === 'true';
  };

  const fetchFilas = async () => {
    try {
      setLoading(true);

      const response = await Servs.getAll(
        pagination.page,
        pagination.limit,
        searchInput,
        getEstadoValue(),
      );

      if (!response.ok) {
        toast.error(response.message || 'Error al cargar datos');
        return;
      }

      setFila(response?.data || []);

      setPagination((prev) => ({
        ...prev,
        page: response?.pagination?.page || response?.page || prev.page,
        totalItems:
          response?.pagination?.totalItems ||
          response?.total ||
          0,
        totalPages:
          response?.pagination?.totalPages ||
          response?.totalPages ||
          1,
      }));
    } catch (error) {
      toast.error(error.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilas();
  }, [
    pagination.page,
    pagination.limit,
    searchInput,
    selectEstadoSocio,
  ]);

  const handleToggleStatus = async () => {
    try {
      setLoadingAction(true);

      const socio = modalState?.data;
      const response = await Servs.toggleStatus(socio?.id);

      if (!response.ok) {
        toast.error(response.message || 'Error al actualizar el estado');
        return;
      }

      toast.success(response.message || 'Socio actualizado correctamente');
      closeModal(MODALS.DELETE);
      fetchFilas();
    } catch (error) {
      toast.error(error.message || 'Error inesperado');
    } finally {
      setLoadingAction(false);
    }
  };

  const getNombreCompleto = (socio) => {
    const nombres = socio.nombres || socio.nombres_socio || '';
    const primerApellido =
      socio.primer_apellido || socio.primer_apellido_socio || '';
    const segundoApellido =
      socio.segundo_apellido || socio.segundo_apellido_socio || '';

    return `${nombres} ${primerApellido} ${segundoApellido}`.trim();
  };

  const getEstado = (socio) =>
    socio.estado ?? socio.estado_socio ?? true;

  const columns = useMemo(
    () => [
      {
        accessorKey: 'ci_socio',
        header: 'CI',
        cell: (info) => info.row.original.ci_socio,
      },
      {
        accessorKey: 'ci_expedido',
        header: 'Expedido',
        cell: (info) =>
          info.row.original.ci_expedido ||
          info.row.original.ci_expedido_socio ||
          '-',
      },
      {
        accessorKey: 'nombre_completo',
        header: 'Nombre completo',
        cell: (info) => getNombreCompleto(info.row.original),
      },
      {
        accessorKey: 'numero_celular',
        header: 'Celular',
        cell: (info) =>
          info.row.original.numero_celular ||
          info.row.original.numero_celular_socio ||
          '-',
      },
      {
        accessorKey: 'genero',
        header: 'Género',
        cell: (info) =>
          info.row.original.genero ||
          info.row.original.genero_socio ||
          '-',
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: (info) => {
          const estado = getEstado(info.row.original);

          return (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                estado
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {estado ? 'Activo' : 'Inactivo'}
            </span>
          );
        },
      },
      {
        accessorKey: 'direccion',
        header: 'Dirección',
        cell: (info) => (
          <div className="max-w-60 whitespace-normal wrap-break-words">
            {info.row.original.direccion || 
              info.row.original.direccion_socio ||
              '-'}
          </div>
        ),
      },
      {
        id: 'acciones',
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
          const estado = getEstado(row.original);

          return (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="rounded-xl bg-sky-800 px-3 py-2 text-white hover:bg-sky-900"
                onClick={() => openModal(MODALS.EDIT, row.original)}
              >
                Editar
              </button>

              <button
                type="button"
                className={`rounded-xl border px-3 py-2 ${
                  estado
                    ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                    : 'bg-green-700 text-white hover:bg-green-800'
                }`}
                onClick={() => openModal(MODALS.DELETE, row.original)}
              >
                {estado ? 'DESHABILITAR' : 'HABILITAR'}
              </button>
            </div>
          );
        },
      },
    ],
    [openModal],
  );

  const selectedSocio = modalState?.data;
  const selectedEstado = selectedSocio ? getEstado(selectedSocio) : true;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Socios</h2>

        <button
          type="button"
          className="rounded-xl bg-sky-800 px-10 py-2 text-white hover:bg-sky-900"
          onClick={() => openModal(MODALS.CREATE)}
        >
          Nuevo registro
        </button>
      </div>

      <div className="relative z-50 rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm">
        <div className="block justify-between lg:flex">
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
                onChange={(e) => {
                  setPagination((prev) => ({
                    ...prev,
                    page: 1,
                  }));
                  setSearchInput(e.target.value);
                }}
                className="w-full rounded-2xl border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-900"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setPagination((prev) => ({
                      ...prev,
                      page: 1,
                    }));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="relative z-50 w-full md:max-w-sm">
            <Select
              label="Seleccione estado"
              placeholder="Seleccione un valor"
              value={selectEstadoSocio}
              options={opcionesEstadoSocio}
              onChange={(e) => {
                setPagination((prev) => ({
                  ...prev,
                  page: 1,
                }));
                setSelectEstadoSocio(e.target.value);
              }}
            />
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

      <SocioModal
        open={isModalOpen(MODALS.CREATE)}
        onClose={() => closeModal(MODALS.CREATE)}
        onSuccess={() => {
          closeModal(MODALS.CREATE);
          fetchFilas();
        }}
      />

      <SocioModal
        open={isModalOpen(MODALS.EDIT)}
        isEdit
        socio={modalState?.data}
        onClose={() => closeModal(MODALS.EDIT)}
        onSuccess={() => {
          closeModal(MODALS.EDIT);
          fetchFilas();
        }}
      />

      <ConfirmModal
        open={isModalOpen(MODALS.DELETE)}
        title={
          selectedEstado
            ? '¿Está seguro que desea deshabilitar este socio?'
            : '¿Está seguro que desea habilitar este socio?'
        }
        message="¿Deseas continuar?"
        confirmText={selectedEstado ? 'Sí, deshabilitar' : 'Sí, habilitar'}
        cancelText="Cancelar"
        loading={loadingAction}
        onClose={() => closeModal(MODALS.DELETE)}
        onConfirm={handleToggleStatus}
      />
    </>
  );
}