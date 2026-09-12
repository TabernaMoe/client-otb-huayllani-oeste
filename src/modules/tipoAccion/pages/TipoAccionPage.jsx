import { useCallback, useEffect, useMemo, useState } from 'react';
import { PencilSquareIcon, PlusIcon, TagIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import AccionCatalogTabs from '../../../components/AccionCatalogTabs';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import TipoAccionModal from './TipoAccionModal';
import { TipoAccionServices } from '../services/tipoAccion.services';

export default function TipoAccionPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await TipoAccionServices.getAll({ page, limit, search });
      setData(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_tipo_accion',
        header: 'Tipo de acción',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <TagIcon className="h-5 w-5" />
            </span>
            <span className="font-semibold text-slate-800">{row.original.nombre_tipo_accion}</span>
          </div>
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => setModal(row.original)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Editar
          </button>
        ),
      },
    ],
    [],
  );

  const submitSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Catálogo de acciones"
        description="Administra los tipos y conceptos que pueden asignarse a una acción."
        action={
          <button
            type="button"
            onClick={() => setModal({})}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo tipo
          </button>
        }
      />

      <AccionCatalogTabs />

      <form onSubmit={submitSearch} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar tipo de acción..."
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-600"
        />
        <button className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Buscar
        </button>
      </form>

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

      <TipoAccionModal
        open={modal !== null}
        data={modal?.id ? modal : null}
        onClose={() => setModal(null)}
        onSuccess={() => {
          setModal(null);
          load();
        }}
      />
    </section>
  );
}
