import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import GestionPeriodoTabs from '../../../components/GestionPeriodoTabs';
import GestionModal from '../components/GestionModal';
import { GestionesServices } from '../services/gestiones.services';

const formatDate = (value) => new Date(value).toLocaleDateString('es-BO');

export default function GestionesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchGestiones = async () => {
    try {
      setLoading(true);
      const response = await GestionesServices.getAll({ page, limit, search });
      setData(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudieron cargar las gestiones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGestiones();
  }, [page, limit, search]);

  const columns = useMemo(() => [
    {
      accessorKey: 'anio',
      header: 'Gestión',
      cell: ({ row }) => (
        <div className="flex min-w-44 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CalendarDaysIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-slate-900">Gestión {row.original.anio}</p>
            <p className="text-xs text-slate-500">#{String(row.original.id).padStart(4, '0')}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'vigencia',
      header: 'Vigencia',
      cell: ({ row }) => (
        <span className="text-slate-600">
          {formatDate(row.original.fecha_inicio)} – {formatDate(row.original.fecha_fin)}
        </span>
      ),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ getValue }) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
          getValue() === 'ACTIVO'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-200 text-slate-600'
        }`}>
          {getValue()}
        </span>
      ),
    },
  ], []);

  return (
    <section className="space-y-5">
      <PageHeader
        title="Gestiones"
        description="Administra los años de trabajo y sus períodos mensuales."
        action={(
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" /> Nueva gestión
          </button>
        )}
      />

      <GestionPeriodoTabs />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar gestión..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </div>

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

      <GestionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchGestiones}
      />
    </section>
  );
}
