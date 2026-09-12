import { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../components/DataTable';
import InventarioModal from '../components/InventarioModal';
import { InventarioServices } from '../inventario.services';

export default function InventarioPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);

  const loadProductos = async () => {
    try {
      setLoading(true);

      const response = await InventarioServices.getAll({
        page,
        limit,
        search,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      setProductos(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, [page, limit, search]);

  const moverStock = async (id, tipo) => {
    try {
      const response =
        tipo === 'entrada'
          ? await InventarioServices.sumar(id)
          : await InventarioServices.restar(id);

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      loadProductos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = [
    {
      accessorKey: 'nombre_producto',
      header: 'Producto',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-800">
            {row.original.nombre_producto}
          </p>
          <p className="text-xs text-slate-400">Producto #{row.original.id}</p>
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
            onClick={() => moverStock(row.original.id, 'entrada')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            <PlusIcon className="h-4 w-4" />
            Entrada
          </button>

          <button
            type="button"
            onClick={() => moverStock(row.original.id, 'salida')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
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
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventario</h1>
          <p className="mt-1 text-sm text-slate-500">
            Administra productos, existencias, entradas y salidas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal('create')}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo producto
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            placeholder="Buscar producto..."
            className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
          />
        </div>
      </div>

      <DataTable
        data={productos}
        columns={columns}
        loading={loading}
        page={page}
        limit={limit}
        totalItems={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setPage(1);
          setLimit(value);
        }}
      />

      <InventarioModal
        open={Boolean(modal)}
        producto={modal === 'create' ? null : modal}
        onClose={() => setModal(null)}
        onSuccess={() => {
          setModal(null);
          loadProductos();
        }}
      />
    </section>
  );
}
