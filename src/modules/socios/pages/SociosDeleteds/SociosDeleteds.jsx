import { useEffect, useMemo, useState } from 'react';
import {
  ArrowPathIcon,
  ArchiveBoxXMarkIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import DataTable from '../../../../components/DataTable';
import ConfirmModal from '../../../../components/ConfirmModal';
import { SocioServices as Servs } from '../../services/socio.services';
import { MODALS, useModalManager } from '../../../../hooks/useModalManager';

function SocioNameCell({ socio }) {
  const nombre = `${socio?.nombres_socio || ''} ${socio?.primer_apellido_socio || ''} ${socio?.segundo_apellido_socio || ''}`.trim();

  return (
    <div className="flex min-w-56 items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        <UserIcon className="h-5 w-5" />
      </span>

      <span>
        <span className="block font-bold text-slate-900">
          {nombre || 'Sin nombre'}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500">
          CI: {socio?.ci_socio} {socio?.ci_expedido_socio || ''}
        </span>
      </span>
    </div>
  );
}

export default function SociosDeleteds() {
  const [filas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { closeModal, isModalOpen, modalState, openModal } =
    useModalManager();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  const fetchFilas = async () => {
    try {
      setLoading(true);

      const response = await Servs.getAllDeleteds(
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
        page: response?.pagination?.page || previous.page,
        totalItems: response?.pagination?.totalItems || 0,
        totalPages: response?.pagination?.totalPages || 1,
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

  const handleRestore = async () => {
    try {
      setRestoring(true);

      const response = await Servs.restore(modalState?.data);

      if (!response.ok) {
        toast.error(response.message || 'Error al restaurar');
        return;
      }

      toast.success(response.message || 'Socio restaurado correctamente');
      closeModal(MODALS.CONFIRM);
      fetchFilas();
    } catch (error) {
      toast.error(error.message || 'No se puede restaurar el socio');
    } finally {
      setRestoring(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'ci_socio',
        header: 'Socio',
        cell: (info) => {
          const socio = info.row.original;
          const nombre = `${socio.nombres_socio || ''} ${
            socio.primer_apellido_socio || ''
          } ${socio.segundo_apellido_socio || ''}`.trim();

          return (
            <div className="flex min-w-56 items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <UserIcon className="h-5 w-5" />
              </span>

              <span>
                <span className="block font-bold text-slate-900">
                  {nombre || 'Sin nombre'}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  CI: {socio.ci_socio} {socio.ci_expedido_socio || ''}
                </span>
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'numero_celular_socio',
        header: 'Contacto',
        cell: (info) => (
          <div className="flex items-center gap-2 text-slate-600">
            <PhoneIcon className="h-4 w-4 text-slate-400" />
            {info.row.original.numero_celular_socio || '-'}
          </div>
        ),
      },
      {
        accessorKey: 'genero_socio',
        header: 'Género',
        cell: (info) => info.row.original.genero_socio || '-',
      },
      {
        accessorKey: 'direccion_socio',
        header: 'Dirección',
        cell: (info) => (
          <div className="flex max-w-72 items-start gap-2 whitespace-normal wrap-break-words text-slate-600">
            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            {info.row.original.direccion_socio || '-'}
          </div>
        ),
      },
      {
        id: 'acciones',
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => openModal(MODALS.CONFIRM, row.original.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Restaurar
            </button>
          </div>
        ),
      },
    ],
    [openModal],
  );

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Socios eliminados
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Consulta y restaura socios eliminados anteriormente.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Total eliminados
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-slate-900">
              {pagination.totalItems}
            </p>
            <span className="rounded-full bg-red-50 p-3 text-red-600">
              <ArchiveBoxXMarkIcon className="h-6 w-6" />
            </span>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Registros visibles
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-slate-900">
              {filas.length}
            </p>
            <span className="rounded-full bg-slate-100 p-3 text-slate-600">
              <UserIcon className="h-6 w-6" />
            </span>
          </div>
        </article>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-md">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Buscar socio eliminado
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
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={fetchFilas}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
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

      <ConfirmModal
        open={isModalOpen(MODALS.CONFIRM)}
        onClose={() => closeModal(MODALS.CONFIRM)}
        onConfirm={handleRestore}
        title="¿Deseas restaurar este socio?"
        message="El socio volverá a estar disponible en el listado principal."
        confirmText="Sí, restaurar"
        cancelText="Cancelar"
        loading={restoring}
      />
    </section>
  );
}