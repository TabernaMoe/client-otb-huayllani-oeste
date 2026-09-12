import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../components/DataTable';
import ConfirmModal from '../../../components/ConfirmModal';
import PageHeader from '../../../components/PageHeader';
import GestionPeriodoTabs from '../../../components/GestionPeriodoTabs';
import { PeriodosServices } from '../services/periodos.services';
import { periodoIdSchema } from '../schema/periodos.schema';

const estadoClass = {
  ACTIVO: 'bg-emerald-100 text-emerald-700',
  PENDIENTE: 'bg-amber-100 text-amber-700',
  CERRADO: 'bg-slate-200 text-slate-600',
};

export default function PeriodosPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);

  const fetchPeriodos = async () => {
    try {
      setLoading(true);
      const response = await PeriodosServices.getAll({ page, limit });
      setData(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudieron cargar los períodos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodos();
  }, [page, limit]);

  const closePeriodo = async () => {
    const validation = periodoIdSchema.safeParse(selected.id);
    if (!validation.success) return;

    try {
      setClosing(true);
      const response = await PeriodosServices.cerrar(validation.data);
      if (!response.ok) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      setSelected(null);
      fetchPeriodos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo cerrar el período');
    } finally {
      setClosing(false);
    }
  };

  const columns = useMemo(() => [
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
            <p className="text-xs text-slate-500">Mes {row.original.numero_mes}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'fecha_inicio', header: 'Inicio' },
    { accessorKey: 'fecha_fin', header: 'Fin' },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ getValue }) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${estadoClass[getValue()]}`}>
          {getValue()}
        </span>
      ),
    },
    { accessorKey: 'fecha_cierre', header: 'Cierre' },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => row.original.estado === 'ACTIVO' ? (
        <button
          onClick={() => setSelected(row.original)}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
        >
          <LockClosedIcon className="h-4 w-4" /> Cerrar
        </button>
      ) : (
        <span className="text-slate-400">—</span>
      ),
    },
  ], []);

  return (
    <section className="space-y-5">
      <PageHeader
        title="Períodos"
        description="Consulta los meses de la gestión y cierra el período activo."
      />

      <GestionPeriodoTabs />

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
      />

      <ConfirmModal
        open={Boolean(selected)}
        title="Cerrar período"
        message={`¿Deseas cerrar ${selected?.mes || ''}?`}
        confirmText="Cerrar período"
        loading={closing}
        onConfirm={closePeriodo}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
