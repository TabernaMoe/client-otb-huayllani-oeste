import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RectangleStackIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DashboardStatCard from '../../../components/DashboardStatCard';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import StatusBadge from '../../../components/StatusBadge';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { getApiErrorMessage } from '../../../services/error';
import { formatFullName } from '../../../utils/formatters';
import { DashboardServices } from '../services/dashboard.services';

export default function AdminDashboardPage() {
  const [totalAcciones, setTotalAcciones] = useState(0);

  const list = usePaginatedList(DashboardServices.getSocios, {
    initialLimit: 5,
    errorMessage: 'No se pudieron cargar los socios del dashboard',
  });

  const loadAccionesCount = useCallback(async () => {
    try {
      const response = await DashboardServices.getAcciones({ page: 1, limit: 1 });
      setTotalAcciones(Number(response?.total ?? 0));
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'No se pudo cargar el total de acciones'),
      );
    }
  }, []);

  useEffect(() => {
    loadAccionesCount();
  }, [loadAccionesCount]);

  const handleRefresh = async () => {
    await Promise.all([list.reload(), loadAccionesCount()]);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'ci_socio',
        header: 'Socio',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">
              {formatFullName(row.original)}
            </p>
            <p className="text-xs text-slate-500">
              CI {row.original.ci_socio} {row.original.ci_expedido}
            </p>
          </div>
        ),
      },
      { accessorKey: 'numero_celular', header: 'Celular' },
      { accessorKey: 'direccion', header: 'Dirección' },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ getValue }) => <StatusBadge value={Boolean(getValue())} />,
      },
    ],
    [],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Dashboard"
        description="Resumen general de socios y acciones registradas."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardStatCard
          title="Socios"
          value={list.total}
          description="Socios registrados"
          icon={UserGroupIcon}
        />
        <DashboardStatCard
          title="Acciones"
          value={totalAcciones}
          description="Acciones registradas"
          icon={RectangleStackIcon}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Socios registrados
            </h2>
            <p className="text-sm text-slate-500">
              Vista rápida de los socios del sistema.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={list.loading}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Actualizar
          </button>
        </div>

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
      </div>
    </section>
  );
}
