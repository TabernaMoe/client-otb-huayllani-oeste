import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import DataTable from '../../../../components/DataTable';
import { ReportesServices } from '../../services/reportes.services';
import { date, money } from '../../utils/reportes.utils';
import ReportSearch from './ReportSearch';

export default function HistorialCobrosView() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const columns = useMemo(
    () => [
      { accessorKey: 'fecha_emision', header: 'Fecha', cell: ({ row }) => date(row.original.fecha_emision) },
      { accessorKey: 'socio_nombre_completo', header: 'Socio' },
      { accessorKey: 'socio_ci', header: 'CI' },
      { accessorKey: 'accion_codigo_interno', header: 'Acción' },
      { accessorKey: 'tipo_cobro', header: 'Tipo' },
      { accessorKey: 'concepto', header: 'Concepto' },
      { accessorKey: 'monto_pagado', header: 'Pagado', cell: ({ row }) => money(row.original.monto_pagado) },
      { accessorKey: 'saldo', header: 'Saldo', cell: ({ row }) => money(row.original.saldo) },
      { accessorKey: 'estado', header: 'Estado' },
    ],
    [],
  );

  const load = async () => {
    try {
      setLoading(true);
      const response = await ReportesServices.getCobros({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      setData(response.data);
      setPagination((prev) => ({
        ...prev,
        page: response.page,
        total: response.total,
        totalPages: response.totalPages,
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [pagination.page, pagination.limit, search]);

  const changeSearch = (value) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <ReportSearch
          value={search}
          onChange={changeSearch}
          placeholder="Buscar por socio, CI, concepto o acción..."
        />
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        page={pagination.page}
        limit={pagination.limit}
        totalItems={pagination.total}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onLimitChange={(limit) => setPagination((prev) => ({ ...prev, page: 1, limit }))}
      />
    </div>
  );
}
