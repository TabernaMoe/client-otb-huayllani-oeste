import { useEffect, useMemo, useState } from 'react';
import { BanknotesIcon, MagnifyingGlassIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import CobroUniversalModal from '../components/CobroUniversalModal';
import { CobroUniversalServices } from '../services/cobroUniversal.services';

const normalizeList = (response) => {
  if (Array.isArray(response)) return { rows: response, total: response.length, totalPages: 1 };
  const rows = response?.data ?? response?.cobros ?? [];
  return {
    rows: Array.isArray(rows) ? rows : [],
    total: response?.total ?? rows.length ?? 0,
    totalPages: response?.totalPages ?? 1,
  };
};

const actionLabel = (cobro) =>
  cobro.accion?.nro_medidor || cobro.nro_medidor || cobro.accion?.id || cobro.accion_id || '—';

export default function CobroUniversalPage() {
  const [cobros, setCobros] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchCobros = async () => {
    try {
      setLoading(true);
      const response = await CobroUniversalServices.getAll({ page, limit, search });
      const result = normalizeList(response);
      setCobros(result.rows);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCobros();
  }, [page, limit, search]);

  const openCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const openEdit = async (row) => {
    try {
      setLoading(true);
      const detail = await CobroUniversalServices.getById(row.id);
      setSelected(detail?.data ?? detail ?? row);
      setModalOpen(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    { header: 'Código', accessorKey: 'id', cell: ({ row }) => <span className="font-semibold text-slate-700">#{row.original.id}</span> },
    { header: 'Acción', id: 'accion', cell: ({ row }) => <span className="text-slate-700">{actionLabel(row.original)}</span> },
    { header: 'Concepto', accessorKey: 'concepto', cell: ({ row }) => <span className="font-medium text-slate-800">{row.original.concepto}</span> },
    { header: 'Descripción', accessorKey: 'descripcion', cell: ({ row }) => <span className="block max-w-xs truncate text-slate-600">{row.original.descripcion || '—'}</span> },
    { header: 'Importe', accessorKey: 'monto', cell: ({ row }) => <span className="font-semibold text-emerald-700">Bs {Number(row.original.monto ?? 0).toFixed(2)}</span> },
    {
      header: 'Acciones', id: 'acciones', cell: ({ row }) => (
        <div className="flex justify-end">
          <button type="button" onClick={() => openEdit(row.original)} title="Editar cobro" className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
            <PencilSquareIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <section className="space-y-5">
      <PageHeader
        title="Cobros universales"
        description="Administra cobros manuales o extraordinarios asociados a una acción."
        action={
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            <PlusIcon className="h-5 w-5" /> Nuevo cobro
          </button>
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Buscar por concepto, acción o descripción..." className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900">
        <div className="flex items-start gap-3"><BanknotesIcon className="mt-0.5 h-5 w-5 shrink-0" /><p>El concepto y el importe son obligatorios. La edición conserva el mismo código del cobro.</p></div>
      </div>

      <DataTable data={cobros} columns={columns} loading={loading} page={page} limit={limit} totalPages={totalPages} totalItems={total} onPageChange={setPage} onLimitChange={(value) => { setLimit(value); setPage(1); }} />

      <CobroUniversalModal open={modalOpen} cobro={selected} onClose={() => setModalOpen(false)} onSuccess={() => { setModalOpen(false); fetchCobros(); }} />
    </section>
  );
}
