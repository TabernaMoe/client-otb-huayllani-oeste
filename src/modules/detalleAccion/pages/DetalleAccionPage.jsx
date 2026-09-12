import { useCallback, useEffect, useMemo, useState } from 'react';
import { PencilSquareIcon, PlusIcon, PowerIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import AccionCatalogTabs from '../../../components/AccionCatalogTabs';
import ConfirmModal from '../../../components/ConfirmModal';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import DetalleAccionModal from '../components/DetalleAccionModal';
import { DetalleAccionServices } from '../services/detalleAccion.services';

const estadoParam = { true: true, false: false };

export default function DetalleAccionPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [savingEstado, setSavingEstado] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await DetalleAccionServices.getAll({
        page,
        limit,
        search,
        estado: estadoParam[estado],
      });
      setData(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, estado]);

  useEffect(() => {
    load();
  }, [load]);

  const edit = async (id) => {
    try {
      const response = await DetalleAccionServices.getById(id);
      setModal(response.dato);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeEstado = async () => {
    try {
      setSavingEstado(true);
      const response = await DetalleAccionServices.changeEstado(confirm.id);
      toast.success(response.message);
      setConfirm(null);
      load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingEstado(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_accion',
        header: 'Detalle',
        cell: ({ row }) => <span className="font-semibold text-slate-800">{row.original.nombre_accion}</span>,
      },
      { accessorKey: 'nombre_tipo_accion', header: 'Tipo de acción' },
      {
        accessorKey: 'precio_accion',
        header: 'Precio',
        cell: ({ row }) => <span>Bs {Number(row.original.precio_accion).toFixed(2)}</span>,
      },
      {
        accessorKey: 'tipo_cobro',
        header: 'Cobro',
        cell: ({ row }) => (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {row.original.tipo_cobro}
          </span>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => (
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.original.estado ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {row.original.estado ? 'Activo' : 'Inactivo'}
          </span>
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => edit(row.original.id)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
              title="Editar"
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setConfirm(row.original)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
              title="Cambiar estado"
            >
              <PowerIcon className="h-4 w-4" />
            </button>
          </div>
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
            Nuevo detalle
          </button>
        }
      />

      <AccionCatalogTabs />

      <form onSubmit={submitSearch} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_180px_auto]">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar detalle de acción..."
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-600"
        />
        <select
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none"
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
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

      <DetalleAccionModal
        open={modal !== null}
        data={modal?.id ? modal : null}
        onClose={() => setModal(null)}
        onSuccess={() => {
          setModal(null);
          load();
        }}
      />

      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.estado ? 'Deshabilitar detalle' : 'Habilitar detalle'}
        message={`¿Deseas ${confirm?.estado ? 'deshabilitar' : 'habilitar'} “${confirm?.nombre_accion || ''}”?`}
        confirmText="Confirmar"
        loading={savingEstado}
        onConfirm={changeEstado}
        onClose={() => setConfirm(null)}
      />
    </section>
  );
}
