import { useMemo, useState } from 'react';
import { CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline';
import DataTable from '../../../components/DataTable';
import GestionPeriodoTabs from '../../../components/GestionPeriodoTabs';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import StatusBadge from '../../../components/StatusBadge';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { formatDate } from '../../../utils/formatters';
import GestionModal from '../components/GestionModal';
import { GestionesServices } from '../services/gestiones.services';

export default function GestionesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const list = usePaginatedList(GestionesServices.getAll, {
    initialLimit: 5,
    errorMessage: 'No se pudieron cargar las gestiones',
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'anio',
        header: 'Gestión',
        cell: ({ row }) => (
          <div className="flex min-w-44 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CalendarDaysIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-slate-900">
                Gestión {row.original.anio}
              </p>
              <p className="text-xs text-slate-500">
                #{String(row.original.id).padStart(4, '0')}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'vigencia',
        header: 'Vigencia',
        cell: ({ row }) => (
          <span className="text-slate-600">
            {formatDate(row.original.fecha_inicio)} –{' '}
            {formatDate(row.original.fecha_fin)}
          </span>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ getValue }) => <StatusBadge value={getValue()} />,
      },
    ],
    [],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Gestiones"
        description="Administra los años de trabajo y sus períodos mensuales."
        action={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" /> Nueva gestión
          </button>
        }
      />

      <GestionPeriodoTabs />

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar gestión..."
      />

      <DataTable
        data={list.items}
        columns={columns}
        loading={list.loading}
        page={list.page}
        limit={list.limit}
        totalPages={list.totalPages}
        totalItems={list.total}
        onPageChange={list.setPage}
        onLimitChange={list.setLimit}
      />

      <GestionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={list.reload}
      />
    </section>
  );
}
