import { useEffect, useMemo, useState } from 'react';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilSquareIcon,
  PhoneIcon,
  PlusIcon,
  PowerIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
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

  const { closeModal, isModalOpen, modalState, openModal } =
    useModalManager();

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

      setPagination((previous) => ({
        ...previous,
        page:
          response?.pagination?.page ||
          response?.page ||
          previous.page,
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
        header: 'Socio',
        cell: (info) => {
          const socio = info.row.original;

          return (
            <div className="flex min-w-56 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <UserIcon className="h-5 w-5" />
              </span>

              <span>
                <span className="block font-bold text-slate-900">
                  {getNombreCompleto(socio)}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  CI: {socio.ci_socio}{' '}
                  {socio.ci_expedido ||
                    socio.ci_expedido_socio ||
                    ''}
                </span>
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'numero_celular',
        header: 'Contacto',
        cell: (info) => (
          <div className="flex items-center gap-2 text-slate-600">
            <PhoneIcon className="h-4 w-4 text-slate-400" />
            {info.row.original.numero_celular ||
              info.row.original.numero_celular_socio ||
              '-'}
          </div>
        ),
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
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                estado
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-100 text-slate-600'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  estado ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              {estado ? 'Activo' : 'Inactivo'}
            </span>
          );
        },
      },
      {
        accessorKey: 'direccion',
        header: 'Dirección',
        cell: (info) => (
          <div className="flex max-w-72 items-start gap-2 whitespace-normal wrap-break-words text-slate-600">
            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
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
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => openModal(MODALS.EDIT, row.original)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <PencilSquareIcon className="h-4 w-4" />
                Editar
              </button>

              <button
                type="button"
                onClick={() => openModal(MODALS.DELETE, row.original)}
                className={`rounded-lg border p-2 transition ${
                  estado
                    ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                }`}
                title={estado ? 'Deshabilitar' : 'Habilitar'}
              >
                <PowerIcon className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [openModal],
  );

  const resumen = useMemo(() => {
    const activos = filas.filter((socio) => getEstado(socio)).length;
    const inactivos = filas.length - activos;

    return {
      visibles: filas.length,
      activos,
      inactivos,
      total: pagination.totalItems,
    };
  }, [filas, pagination.totalItems]);

  const selectedSocio = modalState?.data;
  const selectedEstado = selectedSocio ? getEstado(selectedSocio) : true;

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Socios registrados
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Administra la información y el estado de los socios.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal(MODALS.CREATE)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo socio
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total de socios" value={resumen.total} icon={UserGroupIcon} />
        <MetricCard label="Visibles" value={resumen.visibles} icon={UserIcon} />
        <MetricCard label="Activos" value={resumen.activos} icon={CheckCircleIcon} />
        <MetricCard label="Inactivos" value={resumen.inactivos} icon={PowerIcon} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-md">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Buscar socio
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

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="w-full sm:w-64">
              <Select
                label="Estado"
                placeholder="Seleccione un valor"
                value={selectEstadoSocio}
                options={opcionesEstadoSocio}
                onChange={(event) => {
                  setPagination((previous) => ({
                    ...previous,
                    page: 1,
                  }));
                  setSelectEstadoSocio(event.target.value);
                }}
              />
            </div>

            <button
              type="button"
              onClick={fetchFilas}
              disabled={loading}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
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
            ? '¿Deseas deshabilitar este socio?'
            : '¿Deseas habilitar este socio?'
        }
        message="Esta acción cambiará el estado del registro."
        confirmText={selectedEstado ? 'Sí, deshabilitar' : 'Sí, habilitar'}
        cancelText="Cancelar"
        loading={loadingAction}
        onClose={() => closeModal(MODALS.DELETE)}
        onConfirm={handleToggleStatus}
      />
    </section>
  );
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}