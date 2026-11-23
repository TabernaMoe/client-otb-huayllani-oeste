import { useMemo, useState } from 'react';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import CambioNombreModal from '../components/CambioNombreModal';
import { CambioNombreServices } from '../services/cambioNombre.services';

const formatMoney = (value) => `Bs ${Number(value).toFixed(2)}`;

export default function CambioNombrePage() {
  const [open, setOpen] = useState(false);

  const list = usePaginatedList(CambioNombreServices.getAll, {
    initialLimit: 10,
    errorMessage: 'No se pudo cargar el historial de cambios de nombre',
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'accion_id',
        header: 'Acción',
        cell: ({ row }) => `#${row.original.accion_id}`,
      },
      {
        id: 'cambio',
        header: 'Cambio de socio',
        cell: ({ row }) => (
          <div className="flex min-w-[430px] items-center gap-3">
            <span className="max-w-[190px] truncate text-slate-600">
              {row.original.socio_antiguo_snapshot}
            </span>
            <ArrowRightIcon className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="max-w-[190px] truncate font-semibold text-slate-800">
              {row.original.socio_nuevo_snapshot}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => (
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
            {row.original.tipo}
          </span>
        ),
      },
      {
        accessorKey: 'monto',
        header: 'Monto',
        cell: ({ row }) => formatMoney(row.original.monto),
      },
      { accessorKey: 'observacion', header: 'Observación' },
    ],
    [],
  );

  return (
    <section className="space-y-6">
      <PageHeader
        title="Cambio de nombre"
        description="Registra transferencias de acciones y consulta su historial."
        action={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo cambio
          </button>
        }
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

      <CambioNombreModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={list.reload}
      />
    </section>
  );
}
