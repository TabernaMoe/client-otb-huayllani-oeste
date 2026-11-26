import { useMemo, useState } from 'react';
import { CalendarDaysIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/ConfirmModal';
import DataTable from '../../../components/DataTable';
import GestionPeriodoTabs from '../../../components/GestionPeriodoTabs';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import SelectComponent from '../../../components/Select';
import StatusBadge from '../../../components/StatusBadge';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { formatZodErrorMessage } from '../../../services/error';
import { formatDate } from '../../../utils/formatters';
import { PERIODO_ESTADO_OPTIONS } from '../../../core/constants/catalogFilters';
import { periodoIdSchema } from '../schema/periodos.schema';
import { PeriodosServices } from '../services/periodos.services';

export default function PeriodosPage() {
  const [selected, setSelected] = useState(null);

  const list = usePaginatedList(PeriodosServices.getAll, {
    initialLimit: 5,
    initialFilters: { estado: '' },
    errorMessage: 'No se pudieron cargar los períodos',
  });
  const { submitting, run } = useAsyncSubmit();

  const handleClosePeriodo = async () => {
    if (!selected) return;
    const validation = periodoIdSchema.safeParse(selected.id);
    if (!validation.success) {
      toast.error(formatZodErrorMessage(validation.error));
      return;
    }

    await run(() => PeriodosServices.cerrar(validation.data), {
      successMessage: (res) => res?.message || 'Período cerrado correctamente',
      errorMessage: 'No se pudo cerrar el período',
      onSuccess: async () => {
        setSelected(null);
        await list.reload();
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'mes',
        header: 'Período',
        cell: ({ row }) => (
          <div className="flex min-w-44 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CalendarDaysIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-slate-900">{row.original.mes}</p>
              <p className="text-xs text-slate-500">
                Mes {row.original.numero_mes}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'fecha_inicio',
        header: 'Inicio',
        cell: ({ getValue }) => formatDate(getValue()),
      },
      {
        accessorKey: 'fecha_fin',
        header: 'Fin',
        cell: ({ getValue }) => formatDate(getValue()),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ getValue }) => <StatusBadge value={getValue()} />,
      },
      {
        accessorKey: 'fecha_cierre',
        header: 'Cierre',
        cell: ({ getValue }) => formatDate(getValue()),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) =>
          row.original.estado === 'ACTIVO' ? (
            <button
              type="button"
              onClick={() => setSelected(row.original)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
            >
              <LockClosedIcon className="h-4 w-4" /> Cerrar
            </button>
          ) : (
            <span className="text-slate-400">—</span>
          ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Períodos"
        description="Consulta los meses de la gestión y cierra el período activo."
      />

      <GestionPeriodoTabs />

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar período por mes..."
      >
        <SelectComponent
          label="Estado"
          name="estado"
          value={list.filters.estado}
          options={PERIODO_ESTADO_OPTIONS}
          onChange={(e) => list.setFilter('estado', e.target.value ?? '')}
        />
      </SearchFilterBar>

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

      <ConfirmModal
        open={Boolean(selected)}
        title="Cerrar período"
        message={`¿Deseas cerrar ${selected?.mes || ''}?`}
        confirmText="Cerrar período"
        loading={submitting}
        onConfirm={handleClosePeriodo}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
