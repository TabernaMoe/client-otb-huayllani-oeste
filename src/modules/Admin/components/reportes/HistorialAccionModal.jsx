import { useEffect, useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../../components/DataTable';
import { ReportesServices } from '../../services/reportes.services';
import { date, money } from '../../utils/reportes.utils';
import ReportSearch from './ReportSearch';

export default function HistorialAccionModal({ action, onClose }) {
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
      { accessorKey: 'tipo_cobro', header: 'Tipo' },
      { accessorKey: 'concepto', header: 'Concepto' },
      { accessorKey: 'descripcion', header: 'Descripción' },
      { accessorKey: 'monto_total', header: 'Total', cell: ({ row }) => money(row.original.monto_total) },
      { accessorKey: 'monto_pagado', header: 'Pagado', cell: ({ row }) => money(row.original.monto_pagado) },
      { accessorKey: 'saldo', header: 'Saldo', cell: ({ row }) => money(row.original.saldo) },
      { accessorKey: 'estado', header: 'Estado' },
    ],
    [],
  );

  const load = async () => {
    try {
      setLoading(true);
      const response = await ReportesServices.getHistorialAccion(action.id, {
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
  }, [action.id, pagination.page, pagination.limit, search]);

  const changeSearch = (value) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-slate-50 shadow-2xl">
        <div className="sticky top-0 z-20 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Historial de la acción #{action.codigo_interno}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {action.nombre_completo} · Medidor {action.nro_medidor}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <ReportSearch
            value={search}
            onChange={changeSearch}
            placeholder="Buscar concepto o descripción..."
          />

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
      </div>
    </div>
  );
}
