import { useEffect, useMemo, useState } from 'react';
import { ArrowPathIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import DataTable from '../../../components/DataTable';
import { CobrosServices } from '../services/cobros.services';
import { formatDate, formatMoney } from '../utils/cobros.utils';

export default function PagosView() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const loadPagos = async () => {
    setLoading(true);
    const response = await CobrosServices.getHistorial({
      page: pagination.page,
      limit: pagination.limit,
    });
    setLoading(false);

    if (!response.ok) {
      setPagos([]);
      return;
    }

    setPagos(response.data);
    setPagination((prev) => ({
      ...prev,
      page: response.page,
      limit: response.limit,
      totalItems: response.total,
      totalPages: response.totalPages,
    }));
  };

  useEffect(() => {
    loadPagos();
  }, [pagination.page, pagination.limit]);

  const columns = useMemo(
    () => [
      { accessorKey: 'socio_nombre_completo', header: 'Socio' },
      { accessorKey: 'concepto', header: 'Concepto' },
      { accessorKey: 'tipo_cobro', header: 'Tipo' },
      {
        accessorKey: 'monto_total',
        header: 'Total',
        cell: ({ row }) => formatMoney(row.original.monto_total),
      },
      {
        accessorKey: 'monto_pagado',
        header: 'Pagado',
        cell: ({ row }) => formatMoney(row.original.monto_pagado),
      },
      {
        accessorKey: 'saldo',
        header: 'Saldo',
        cell: ({ row }) => (
          <span className="font-semibold text-emerald-700">{formatMoney(row.original.saldo)}</span>
        ),
      },
      { accessorKey: 'estado', header: 'Estado' },
      {
        accessorKey: 'fecha_emision',
        header: 'Fecha',
        cell: ({ row }) => formatDate(row.original.fecha_emision),
      },
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <BanknotesIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Historial de pagos</h2>
            <p className="text-sm text-slate-500">Consulta los cobros registrados en el sistema.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadPagos}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      <DataTable
        data={pagos}
        columns={columns}
        loading={loading}
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onLimitChange={(limit) => setPagination((prev) => ({ ...prev, page: 1, limit }))}
      />
    </div>
  );
}
