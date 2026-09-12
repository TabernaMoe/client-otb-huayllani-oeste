import { useEffect, useMemo, useState } from 'react';
import {
  RectangleStackIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import DashboardCard from '../components/DashboardCard';
import { DashboardServices } from '../services/dashboard.services';

const nombreCompleto = (socio) =>
  [socio.nombres, socio.primer_apellido, socio.segundo_apellido]
    .filter(Boolean)
    .join(' ');

export default function AdminDashboardPage() {
  const [socios, setSocios] = useState([]);
  const [totalSocios, setTotalSocios] = useState(0);
  const [totalAcciones, setTotalAcciones] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const [sociosResponse, accionesResponse] = await Promise.all([
        DashboardServices.getSocios({ page, limit }),
        DashboardServices.getAcciones({ page: 1, limit: 1 }),
      ]);

      setSocios(sociosResponse.data);
      setTotalSocios(sociosResponse.total);
      setTotalPages(sociosResponse.totalPages);
      setTotalAcciones(accionesResponse.total);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, limit]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'ci_socio',
        header: 'Socio',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">{nombreCompleto(row.original)}</p>
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
        cell: ({ getValue }) => (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              getValue()
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {getValue() ? 'Activo' : 'Inactivo'}
          </span>
        ),
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
        <DashboardCard
          title="Socios"
          value={totalSocios}
          description="Socios registrados"
          icon={UserGroupIcon}
        />
        <DashboardCard
          title="Acciones"
          value={totalAcciones}
          description="Acciones registradas"
          icon={RectangleStackIcon}
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Socios registrados</h2>
            <p className="text-sm text-slate-500">Vista rápida de los socios del sistema.</p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Actualizar
          </button>
        </div>

        <DataTable
          data={socios}
          columns={columns}
          loading={loading}
          page={page}
          limit={limit}
          totalPages={totalPages}
          totalItems={totalSocios}
          onPageChange={setPage}
          onLimitChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
        />
      </div>
    </section>
  );
}
