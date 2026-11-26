import { useMemo } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import StatusBadge from '../../../components/StatusBadge';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { AdelantoPagosServices } from '../services/adelantoPagos.services';

export default function AdelantoPagosPage() {
  const list = usePaginatedList(AdelantoPagosServices.getAccionesPasivas, {
    initialLimit: 10,
    errorMessage: 'No se pudieron cargar las acciones pasivas',
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'codigo_interno',
        header: 'Código',
        cell: ({ row }) => (
          <p className="font-semibold text-slate-900">
            {row.original.codigo_interno}
          </p>
        ),
      },
      {
        accessorKey: 'nombre_completo',
        header: 'Socio',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-900">
              {row.original.nombre_completo}
            </p>
            {row.original.nro_medidor && (
              <p className="text-xs text-slate-400">
                Medidor: {row.original.nro_medidor}
              </p>
            )}
          </div>
        ),
      },
      { accessorKey: 'nombre_calle', header: 'Calle' },
      { accessorKey: 'nombre_tarifa', header: 'Tarifa' },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ getValue }) => <StatusBadge value={getValue() || 'PASIVO'} />,
      },
    ],
    [],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Adelanto de pagos"
        description="Listado de acciones pasivas habilitadas para el flujo de adelanto de mantenimiento."
      />

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex items-start gap-3">
          <BanknotesIcon className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            El listado de acciones pasivas está conectado al backend. Cuando el
            backend exponga el endpoint de registro de pagos adelantados se
            habilitará la acción directa desde esta pantalla.
          </p>
        </div>
      </div>

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar por socio, código o medidor..."
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
    </section>
  );
}
