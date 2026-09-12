import { useEffect, useMemo, useState } from 'react';
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import DataTable from '../../../components/DataTable';
import ConfirmModal from '../../../components/ConfirmModal';
import PageHeader from '../../../components/PageHeader';
import AlcantarilladoModal from '../components/AlcantarilladoModal';
import { AlcantarilladoServices } from '../services/alcantarillado.services';

const money = (value) => `Bs ${Number(value).toFixed(2)}`;

export default function AlcantarilladoPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, item: null });
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const load = async () => {
    setLoading(true);
    const response = await AlcantarilladoServices.getAll({ page, limit, search });
    setLoading(false);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    setData(response.data);
    setTotalPages(response.totalPages);
    setTotalItems(response.total);
  };

  useEffect(() => {
    load();
  }, [page, limit, search]);

  const changeEstado = async () => {
    const response = await AlcantarilladoServices.changeEstado(confirm.item.id);
    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    setConfirm({ open: false, item: null });
    load();
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'nombre_accion', header: 'Detalle' },
      {
        accessorKey: 'precio_accion',
        header: 'Precio',
        cell: ({ row }) => money(row.original.precio_accion),
      },
      {
        accessorKey: 'tipo_cobro',
        header: 'Cobro',
        cell: ({ row }) => (
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
            {row.original.tipo_cobro}
          </span>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              row.original.estado
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {row.original.estado ? 'Activo' : 'Inactivo'}
          </span>
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModal({ open: true, item: row.original })}
              className="rounded-lg p-2 text-sky-700 hover:bg-sky-50"
              title="Editar"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setConfirm({ open: true, item: row.original })}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              title="Cambiar estado"
            >
              <PowerIcon className="h-5 w-5" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-6">
      <PageHeader
        title="Alcantarillado"
        description="Administra los conceptos y precios asociados al alcantarillado."
        action={
          <button
            onClick={() => setModal({ open: true, item: null })}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo detalle
          </button>
        }
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setSearch(searchInput.trim());
        }}
        className="flex max-w-xl gap-2"
      >
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Buscar detalle..."
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
          />
        </div>
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
        totalItems={totalItems}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setPage(1);
          setLimit(value);
        }}
      />

      <AlcantarilladoModal
        open={modal.open}
        item={modal.item}
        onClose={() => setModal({ open: false, item: null })}
        onSaved={load}
      />

      <ConfirmModal
        open={confirm.open}
        title="Cambiar estado"
        message={`¿Deseas cambiar el estado de ${confirm.item?.nombre_accion || ''}?`}
        confirmText="Confirmar"
        onConfirm={changeEstado}
        onClose={() => setConfirm({ open: false, item: null })}
      />
    </section>
  );
}
