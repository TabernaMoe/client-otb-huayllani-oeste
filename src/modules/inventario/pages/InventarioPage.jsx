import { useCallback, useMemo, useState } from 'react';
import {
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import InventarioModal from '../components/InventarioModal';
import { InventarioServices } from '../inventario.services';

export default function InventarioPage() {
  const [modal, setModal] = useState(null);

  const list = usePaginatedList(InventarioServices.getAll, {
    initialLimit: 5,
    errorMessage: 'No se pudo cargar el inventario',
  });
  const { submitting, run } = useAsyncSubmit();

  const moverStock = useCallback(
    async (id, tipo) => {
      await run(
        () =>
          tipo === 'entrada'
            ? InventarioServices.sumar(id)
            : InventarioServices.restar(id),
        {
          successMessage: (res) =>
            res?.message ||
            (tipo === 'entrada' ? 'Entrada registrada' : 'Salida registrada'),
          errorMessage: 'No se pudo actualizar el stock',
          onSuccess: list.reload,
        },
      );
    },
    [run, list.reload],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_producto',
        header: 'Producto',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-800">
              {row.original.nombre_producto}
            </p>
            <p className="text-xs text-slate-400">
              Producto #{row.original.id}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'saldo_actual',
        header: 'Saldo actual',
        cell: ({ row }) => (
          <span className="rounded-lg bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
            {row.original.saldo_actual}
          </span>
        ),
      },
      {
        accessorKey: 'salida',
        header: 'Salidas',
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => moverStock(row.original.id, 'entrada')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
            >
              <PlusIcon className="h-4 w-4" />
              Entrada
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => moverStock(row.original.id, 'salida')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
            >
              <MinusIcon className="h-4 w-4" />
              Salida
            </button>

            <button
              type="button"
              onClick={() => setModal(row.original)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <PencilSquareIcon className="h-4 w-4" />
              Editar
            </button>
          </div>
        ),
      },
    ],
    [moverStock, submitting],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Inventario"
        description="Administra productos, existencias, entradas y salidas."
        action={
          <button
            type="button"
            onClick={() => setModal('create')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo producto
          </button>
        }
      />

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar producto..."
      />

      <DataTable
        data={list.items}
        columns={columns}
        loading={list.loading}
        page={list.page}
        limit={list.limit}
        totalItems={list.total}
        totalPages={list.totalPages}
        onPageChange={list.setPage}
        onLimitChange={list.setLimit}
      />

      <InventarioModal
        open={Boolean(modal)}
        producto={modal === 'create' ? null : modal}
        onClose={() => setModal(null)}
        onSuccess={async () => {
          setModal(null);
          await list.reload();
        }}
      />
    </section>
  );
}
