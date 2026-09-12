import { useEffect, useMemo, useState } from 'react';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import CambioNombreModal from '../components/CambioNombreModal';
import { CambioNombreServices } from '../services/cambioNombre.services';

const money = (value) => `Bs ${Number(value).toFixed(2)}`;

export default function CambioNombrePage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const response = await CambioNombreServices.getAll({ page, limit });
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
  }, [page, limit]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'accion_id',
        header: 'Acción',
        cell: ({ row }) => `#${row.original.accion_id}`,
      },
      {
        id: 'cambio',
        header: 'Cambio de socio',
        cell: ({ row }) => (
          <div className="flex min-w-[430px] items-center gap-3">
            <span className="max-w-[190px] truncate text-slate-600">
              {row.original.socio_antiguo_snapshot}
            </span>
            <ArrowRightIcon className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="max-w-[190px] truncate font-semibold text-slate-800">
              {row.original.socio_nuevo_snapshot}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => (
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
            {row.original.tipo}
          </span>
        ),
      },
      {
        accessorKey: 'monto',
        header: 'Monto',
        cell: ({ row }) => money(row.original.monto),
      },
      { accessorKey: 'observacion', header: 'Observación' },
    ],
    [],
  );

  return (
    <section className="space-y-6">
      <PageHeader
        title="Cambio de nombre"
        description="Registra transferencias de acciones y consulta su historial."
        action={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo cambio
          </button>
        }
      />

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

      <CambioNombreModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={load}
      />
    </section>
  );
}
